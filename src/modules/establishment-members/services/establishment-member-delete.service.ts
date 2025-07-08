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
    memberId: string,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting member ${memberId} from establishment ${establishmentId} by requester ${requesterId}`,
    );

    // Valida se o requester tem permissão no estabelecimento
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    // Verifica se o membro existe
    const exists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        memberId,
        establishmentId,
      );

    if (!exists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
      );
    }

    await this.establishmentMemberRepository.deleteByUserAndEstablishment(
      memberId,
      establishmentId,
    );

    this.logger.log(
      `Member ${memberId} deleted from establishment ${establishmentId}`,
    );
  }
}
