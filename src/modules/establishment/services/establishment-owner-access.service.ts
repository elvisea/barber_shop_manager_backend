import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class EstablishmentOwnerAccessService {
  private readonly logger = new Logger(EstablishmentOwnerAccessService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Verifica se o estabelecimento existe e se o usuário é o dono
   * @param establishmentId string
   * @param ownerId string
   * @returns establishment entity se encontrado e usuário é dono
   */
  async assertOwnerHasAccess(establishmentId: string, ownerId: string) {
    this.logger.log(
      `Checking owner access for user ${ownerId} to establishment ${establishmentId}`,
    );

    // 1. Verifica se o estabelecimento existe
    const establishment =
      await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(
        `Establishment not found: ${establishmentId} | User: ${ownerId}`,
      );

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 2. Verifica se o usuário é o dono do estabelecimento
    if (establishment.ownerId !== ownerId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: ownerId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    this.logger.log(
      `Owner access granted for user ${ownerId} to establishment ${establishmentId}`,
    );

    return establishment;
  }
}
