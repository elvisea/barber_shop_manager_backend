import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentFindOneService {
  private readonly logger = new Logger(EstablishmentFindOneService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentFindOneResponseDTO> {
    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      userId,
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

    return establishment;
  }
}
