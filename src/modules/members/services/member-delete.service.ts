import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

@Injectable()
export class MemberDeleteService {
  private readonly logger = new Logger(MemberDeleteService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(memberId: string, requesterId: string): Promise<void> {
    this.logger.log(`Deleting member ${memberId} by user ${requesterId}`);

    const existingMember =
      await this.memberRepository.findByIdWithEstablishment(memberId);

    if (!existingMember) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // Buscar o primeiro UserEstablishment do membro para obter o establishment
    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(
        memberId,
      );

    if (userEstablishments.length === 0) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        {
          USER_ID: memberId,
          ESTABLISHMENT_ID: 'unknown',
        },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // Verificar se o requester é dono de pelo menos um dos estabelecimentos do membro
    const isOwner = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!isOwner) {
      const establishmentId = userEstablishments[0].establishment.id;
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        {
          ESTABLISHMENT_ID: establishmentId,
          USER_ID: requesterId,
        },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

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
        },
        errorParams: {
          MEMBER_ID: memberId,
        },
      });
    }
  }
}
