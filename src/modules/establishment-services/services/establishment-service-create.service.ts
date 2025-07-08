import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { ErrorMessageService } from '../../../error-message/error-message.service';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceRepository } from '../repositories/establishment-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentServiceCreateService {
  private readonly logger = new Logger(EstablishmentServiceCreateService.name);

  constructor(
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) { }

  async execute(
    dto: EstablishmentServiceCreateRequestDTO,
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    this.logger.log(
      `Creating service "${dto.name}" for establishment ${establishmentId} by user ${userId}`,
    );

    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
    );

    this.logger.log(
      `Establishment ${establishmentId} found for user ${userId}. Proceeding with service creation.`,
    );

    this.logger.log(
      `Checking if service with name "${dto.name}" already exists in establishment ${establishmentId}`,
    );

    const alreadyExists =
      await this.establishmentServiceRepository.existsByName(
        establishmentId,
        dto.name,
      );

    if (alreadyExists) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
        { ESTABLISHMENT_ID: establishmentId, NAME: dto.name },
      );

      this.logger.warn(errorMessage);

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
      );
    }

    const service = await this.establishmentServiceRepository.createService(
      dto,
      establishmentId,
    );

    this.logger.log(`Service created with ID: ${service.id}`);

    const convertedCommission = Number(service.commission);

    return {
      ...service,
      commission: convertedCommission,
    };
  }
}
