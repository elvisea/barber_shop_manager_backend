import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  EstablishmentCustomer,
  EstablishmentService,
  UserEstablishment,
  UserRole,
} from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';
import { EstablishmentAccessResult } from '@/shared/establishment-access/types/establishment-access-result.type';

/** Re-export for consumers that need the access result type (e.g. appointment permission checks). */
export type { EstablishmentAccessResult };

const RESTRICT_TO_OWN_APPOINTMENTS_ROLES: UserRole[] = [
  UserRole.HAIRDRESSER,
  UserRole.BARBER,
];

/**
 * Handles appointment-specific permissions and entity validations.
 * Does not contain "can user access establishment" logic; that is delegated to EstablishmentAccessService.
 * This service handles: (1) appointment permissions (who can act for which member), and
 * (2) entity validations (customer, member, services exist in the establishment).
 */
@Injectable()
export class AppointmentAccessValidationService {
  private readonly logger = new Logger(AppointmentAccessValidationService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Delegates to the centralized EstablishmentAccessService and returns the access result.
   * Use the returned result in assertRequesterCanActForMember for appointment permission checks.
   */
  async validateCanCreate(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentAccessResult> {
    this.logger.log(
      `Validating user ${userId} can create appointments in establishment ${establishmentId}`,
    );
    return this.establishmentAccessService.getEstablishmentAccess(
      userId,
      establishmentId,
    );
  }

  /**
   * Uses the centralized access result (isOwner, role) to apply the appointment permission rule:
   * OWNER and RECEPTIONIST can act for any member; BARBER and HAIRDRESSER only for themselves.
   * @throws CustomHttpException when the requester cannot act for the target member
   */
  assertRequesterCanActForMember(
    accessResult: EstablishmentAccessResult,
    requesterId: string,
    targetMemberId: string,
  ): void {
    if (accessResult.isOwner) {
      return;
    }

    const role = accessResult.userEstablishment?.role;
    if (role === UserRole.RECEPTIONIST) {
      return;
    }

    if (
      role &&
      RESTRICT_TO_OWN_APPOINTMENTS_ROLES.includes(role) &&
      targetMemberId !== requesterId
    ) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.APPOINTMENT_ACCESS_DENIED,
      );
      this.logger.warn(
        `User ${requesterId} (role=${role}) cannot act for member ${targetMemberId}`,
      );
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.APPOINTMENT_ACCESS_DENIED,
      );
    }
  }

  /**
   * Validates that the customer exists in the establishment.
   */
  async validateCustomer(
    establishmentId: string,
    customerId: string,
  ): Promise<EstablishmentCustomer> {
    this.logger.log(
      `Validating customer ${customerId} in establishment ${establishmentId}`,
    );

    const customer =
      await this.establishmentCustomerRepository.findByIdAndEstablishment(
        customerId,
        establishmentId,
      );

    if (!customer) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
        { CUSTOMER_ID: customerId, ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(
        `Customer ${customerId} not found in establishment ${establishmentId}`,
      );
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
      );
    }

    this.logger.log(`Customer ${customerId} validated successfully`);
    return customer;
  }

  /**
   * Validates that the user (member) exists and is active in the establishment.
   */
  async validateUser(
    establishmentId: string,
    userId: string,
  ): Promise<UserEstablishment> {
    this.logger.log(
      `Validating user ${userId} in establishment ${establishmentId}`,
    );

    const userEstablishment =
      await this.userEstablishmentRepository.findByUserAndEstablishment(
        userId,
        establishmentId,
      );

    if (!userEstablishment || !userEstablishment.isActive) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      this.logger.warn(
        `User ${userId} not found or inactive in establishment ${establishmentId}`,
      );
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    this.logger.log(`User ${userId} validated successfully`);
    return userEstablishment;
  }

  /**
   * Validates that all given services exist in the establishment.
   */
  async validateServices(
    establishmentId: string,
    serviceIds: string[],
  ): Promise<EstablishmentService[]> {
    this.logger.log(
      `Validating ${serviceIds.length} services in establishment ${establishmentId}`,
    );

    const found =
      await this.establishmentServiceRepository.findManyByIdsAndEstablishment(
        establishmentId,
        serviceIds,
      );

    const byId = new Map(found.map((s) => [s.id, s]));
    const validatedServices: EstablishmentService[] = [];

    for (const serviceId of serviceIds) {
      const service = byId.get(serviceId);
      if (!service) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
          { SERVICE_ID: serviceId, ESTABLISHMENT_ID: establishmentId },
        );
        this.logger.warn(
          `Service ${serviceId} not found in establishment ${establishmentId}`,
        );
        throw new CustomHttpException(
          message,
          HttpStatus.NOT_FOUND,
          ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        );
      }
      validatedServices.push(service);
    }

    this.logger.log(`All ${serviceIds.length} services validated successfully`);
    return validatedServices;
  }

  /**
   * Validates that the given services are allowed for the user (member) in the establishment.
   * TODO: Implement when member-services is ready; currently only validates user exists.
   */
  async validateUserAllowedServices(
    establishmentId: string,
    userId: string,
    serviceIds: string[],
  ): Promise<void> {
    this.logger.log(
      `Validating user ${userId} allowed services in establishment ${establishmentId}`,
    );
    await this.validateUser(establishmentId, userId);
    this.logger.log(
      `All ${serviceIds.length} services allowed for user ${userId} in establishment ${establishmentId}`,
    );
  }
}
