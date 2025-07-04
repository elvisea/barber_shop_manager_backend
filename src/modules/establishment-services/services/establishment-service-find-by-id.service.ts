import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentMembershipService } from '@/modules/establishment/services/establishment-membership.service';

@Injectable()
export class EstablishmentServiceFindByIdService {
  private readonly logger = new Logger(
    EstablishmentServiceFindByIdService.name,
  );

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentMembershipService: EstablishmentMembershipService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    serviceId: string,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    this.logger.log(
      `Finding service with ID ${serviceId} for establishment ${establishmentId} by user ${userId}`,
    );

    await this.establishmentMembershipService.validateMembership(
      establishmentId,
      userId,
    );

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

    return {
      id: service.id,
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      commission: Number(service.commission),
      establishmentId: service.establishmentId,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }
}
