import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class MemberDeleteService {
  private readonly logger = new Logger(MemberDeleteService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
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

    if (existingMember.establishment.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        {
          ESTABLISHMENT_ID: existingMember.establishment.id,
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
