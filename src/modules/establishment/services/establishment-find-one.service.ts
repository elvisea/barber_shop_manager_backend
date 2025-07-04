import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';

import { EstablishmentMembershipService } from './establishment-membership.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentFindOneService {
  private readonly logger = new Logger(EstablishmentFindOneService.name);

  constructor(
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentMembershipService: EstablishmentMembershipService,
  ) { }

  async execute(
    establishmentId: string,
    userId: string,
  ): Promise<EstablishmentFindOneResponseDTO> {
    this.logger.log(
      `Finding establishment with ID ${establishmentId} for userId=${userId}`,
    );

    const memberWithEstablishment =
      await this.establishmentMembershipService.validateMembership(
        establishmentId,
        userId,
        [Role.ADMIN],
      );
    const establishment = memberWithEstablishment.establishment;

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

    return {
      id: establishment.id,
      name: establishment.name,
      address: establishment.address,
      phone: establishment.phone,
      createdAt: establishment.createdAt,
      updatedAt: establishment.updatedAt,
    };
  }
}
