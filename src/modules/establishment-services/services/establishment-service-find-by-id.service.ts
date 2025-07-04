import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentServiceFindByIdService {
  private readonly logger = new Logger(
    EstablishmentServiceFindByIdService.name,
  );

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentRepository: EstablishmentRepository,
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

    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    const establishment = await this.establishmentRepository.findByIdAndUser(
      establishmentId,
      userId,
    );

    if (!establishment) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    this.logger.log(
      `Establishment ${establishmentId} found for user ${userId}.`,
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
