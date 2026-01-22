import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class MemberDeleteService {
  private readonly logger = new Logger(MemberDeleteService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    establishmentId: string,
    memberId: string,
    requesterId: string,
  ): Promise<void> {
    this.logger.log(
      `Deleting member ${memberId} from establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Verifica se o membro existe no estabelecimento
    const existingMember = await this.memberRepository.findByEstablishmentAndId(
      establishmentId,
      memberId,
    );

    if (!existingMember) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // 3. Exclui o membro
    try {
      await this.memberRepository.deleteMember(memberId);

      this.logger.log(`Member deleted: ${memberId}`);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_DELETE_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to delete member',
        logContext: {
          memberId,
          establishmentId,
        },
        errorParams: {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
        },
      });
    }
  }
}
