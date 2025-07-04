import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../../establishment/repositories/establishment.repository';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceUpdateRequestDTO } from '../dtos/establishment-service-update-request.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentServiceUpdateService {
  private readonly logger = new Logger(EstablishmentServiceUpdateService.name);

  constructor(
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    serviceId: string,
    establishmentId: string,
    userId: string,
    dto: EstablishmentServiceUpdateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    this.logger.log(
      `Updating service with ID ${serviceId} for establishment ${establishmentId} by user ${userId}`,
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

    const updated = await this.establishmentServiceRepository.updateById(
      serviceId,
      dto,
    );

    this.logger.log(`Service ${serviceId} updated successfully.`);

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      duration: updated.duration,
      price: updated.price,
      commission: Number(updated.commission),
      establishmentId: updated.establishmentId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
