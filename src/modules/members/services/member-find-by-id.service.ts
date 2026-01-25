import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class MemberFindByIdService {
  private readonly logger = new Logger(MemberFindByIdService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    memberId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(`Finding member ${memberId} by user ${requesterId}`);

    const member =
      await this.memberRepository.findByIdWithEstablishment(memberId);

    if (!member) {
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

    if (member.establishment.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: member.establishment.id, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    this.logger.log(`Member found: ${member.id}`);

    return MemberMapper.toResponseDTO(member, false);
  }
}
