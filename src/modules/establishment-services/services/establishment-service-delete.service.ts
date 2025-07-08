import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentServiceDeleteService {
  private readonly logger = new Logger(EstablishmentServiceDeleteService.name);

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    serviceId: string,
    establishmentId: string,
    userId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting service with ID ${serviceId} for establishment ${establishmentId} by user ${userId}`,
    );

    const establishment =
      await this.establishmentRepository.findByIdWithMembersAdmin(
        establishmentId,
      );

    if (!establishment) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        {
          ESTABLISHMENT_ID: establishmentId,
        },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    const member = establishment.members.find((m) => m.userId === userId);
    if (!member) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: userId,
        },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    if (member.role !== 'ADMIN') {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: userId,
        },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.FORBIDDEN,
        ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
      );
    }

    const service =
      await this.establishmentServiceRepository.findByIdAndEstablishment(
        serviceId,
        establishmentId,
      );

    if (!service) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        { SERVICE_ID: serviceId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
      );
    }

    await this.establishmentServiceRepository.deleteById(serviceId);

    this.logger.log(`Service ${serviceId} deleted successfully.`);
  }
}
