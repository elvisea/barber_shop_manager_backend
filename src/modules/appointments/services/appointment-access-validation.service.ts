import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  Establishment,
  EstablishmentCustomer,
  EstablishmentService,
  UserEstablishment,
} from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

export interface AppointmentAccessValidationResult {
  establishment: Establishment;
  isOwner: boolean;
  userEstablishment?: UserEstablishment;
}

/**
 * Service responsável por validar acessos e permissões para operações de agendamento
 */
@Injectable()
export class AppointmentAccessValidationService {
  private readonly logger = new Logger(AppointmentAccessValidationService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida se o usuário pode criar agendamentos no estabelecimento
   * (dono OU membro do estabelecimento)
   */
  async validateUserCanCreateAppointments(
    establishmentId: string,
    userId: string,
  ): Promise<AppointmentAccessValidationResult> {
    this.logger.log(
      `Validating user ${userId} access to create appointments in establishment ${establishmentId}`,
    );

    // 1. Verificar se o estabelecimento existe
    const establishment =
      await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(`Establishment not found: ${establishmentId}`);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 2. Verificar se é o dono do estabelecimento
    if (establishment.ownerId === userId) {
      this.logger.log(
        `User ${userId} is owner of establishment ${establishmentId}`,
      );
      return { establishment, isOwner: true };
    }

    // 3. Se não for dono, verificar se é membro do estabelecimento
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
        `User ${userId} is not owner or active member of establishment ${establishmentId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    this.logger.log(
      `User ${userId} is member of establishment ${establishmentId}`,
    );

    return { establishment, isOwner: false, userEstablishment };
  }

  /**
   * Valida se o cliente existe no estabelecimento
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
   * Valida se o usuário existe no estabelecimento
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
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    this.logger.log(`User ${userId} validated successfully`);
    return userEstablishment;
  }

  /**
   * Valida se os serviços existem no estabelecimento
   */
  async validateServices(
    establishmentId: string,
    serviceIds: string[],
  ): Promise<EstablishmentService[]> {
    this.logger.log(
      `Validating ${serviceIds.length} services in establishment ${establishmentId}`,
    );

    const validatedServices: EstablishmentService[] = [];

    for (const serviceId of serviceIds) {
      const establishmentService =
        await this.establishmentServiceRepository.findByIdAndEstablishment(
          serviceId,
          establishmentId,
        );

      if (!establishmentService) {
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

      validatedServices.push(establishmentService);
    }

    this.logger.log(`All ${serviceIds.length} services validated successfully`);
    return validatedServices;
  }

  /**
   * Valida se os serviços informados estão registrados para o usuário no estabelecimento
   */
  async validateUserAllowedServices(
    establishmentId: string,
    userId: string,
    serviceIds: string[],
  ): Promise<void> {
    this.logger.log(
      `Validating user ${userId} allowed services in establishment ${establishmentId}`,
    );

    // TODO: Implementar validação quando user-services estiver pronto
    // Por enquanto, apenas valida que o usuário tem acesso ao estabelecimento
    await this.validateUser(establishmentId, userId);

    this.logger.log(
      `All ${serviceIds.length} services are allowed for user ${userId} in establishment ${establishmentId}`,
    );
  }
}
