import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class MemberFindByIdService {
  private readonly logger = new Logger(MemberFindByIdService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    establishmentId: string,
    memberId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(
      `Finding member ${memberId} in establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Busca o membro no estabelecimento
    const member = await this.memberRepository.findByEstablishmentAndId(
      establishmentId,
      memberId,
    );

    if (!member) {
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

    this.logger.log(`Member found: ${member.id}`);

    return MemberMapper.toResponseDTO(member, false);
  }
}
