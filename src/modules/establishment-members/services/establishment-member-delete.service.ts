import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberRepository } from '../repositories/establishment-member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentMemberDeleteService {
  private readonly logger = new Logger(EstablishmentMemberDeleteService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    establishmentId: string,
    userId: string,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting member ${userId} from establishment ${establishmentId} by requester ${requesterId}`,
    );

    // Valida se o requester tem permissão no estabelecimento
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    // Verifica se o membro existe
    const exists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        userId,
        establishmentId,
      );

    if (!exists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    await this.establishmentMemberRepository.deleteByUserAndEstablishment(
      userId,
      establishmentId,
    );

    this.logger.log(
      `Member ${userId} deleted from establishment ${establishmentId}`,
    );
  }
}
