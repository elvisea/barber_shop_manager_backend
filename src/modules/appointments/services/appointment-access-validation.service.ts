import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  Establishment,
  EstablishmentCustomer,
  EstablishmentService,
  Member,
} from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { MemberRepository } from '@/modules/members/repositories/member.repository';

export interface AppointmentAccessValidationResult {
  establishment: Establishment;
  isOwner: boolean;
  member?: Member;
}

/**
 * Service responsável por validar acessos e permissões para operações de agendamento
 */
@Injectable()
export class AppointmentAccessValidationService {
  private readonly logger = new Logger(AppointmentAccessValidationService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly memberRepository: MemberRepository,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

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
    const member = await this.memberRepository.findByEstablishmentAndId(
      establishmentId,
      userId,
    );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );

      this.logger.warn(
        `User ${userId} is not owner or member of establishment ${establishmentId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    this.logger.log(
      `User ${userId} is member of establishment ${establishmentId}`,
    );

    return { establishment, isOwner: false, member };
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
   * Valida se o membro existe no estabelecimento
   */
  async validateMember(
    establishmentId: string,
    memberId: string,
  ): Promise<Member> {
    this.logger.log(
      `Validating member ${memberId} in establishment ${establishmentId}`,
    );

    const member = await this.memberRepository.findByEstablishmentAndId(
      establishmentId,
      memberId,
    );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(
        `Member ${memberId} not found in establishment ${establishmentId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    this.logger.log(`Member ${memberId} validated successfully`);
    return member;
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
}
