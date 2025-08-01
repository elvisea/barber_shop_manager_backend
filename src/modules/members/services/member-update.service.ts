import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO, MemberUpdateRequestDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/shared/establishment-owner-access/establishment-owner-access.service';

@Injectable()
export class MemberUpdateService {
  private readonly logger = new Logger(MemberUpdateService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    establishmentId: string,
    memberId: string,
    dto: MemberUpdateRequestDTO,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(
      `Updating member ${memberId} in establishment ${establishmentId} by user ${requesterId}`,
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

    // 3. Verifica se o novo email já existe globalmente (se fornecido)
    if (dto.email && dto.email !== existingMember.email) {
      const emailExists = await this.memberRepository.existsByEmailExcludingId(
        dto.email,
        memberId,
      );

      if (emailExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
          { EMAIL: dto.email },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
        );
      }
    }

    // 4. Verifica se o novo telefone já existe globalmente (se fornecido)
    if (dto.phone && dto.phone !== existingMember.phone) {
      const phoneExists = await this.memberRepository.existsByPhoneExcludingId(
        dto.phone,
        memberId,
      );

      if (phoneExists) {
        const message = this.errorMessageService.getMessage(
          ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
          { PHONE: dto.phone },
        );

        this.logger.warn(message);

        throw new CustomHttpException(
          message,
          HttpStatus.CONFLICT,
          ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
        );
      }
    }

    // 5. Atualiza o membro
    try {
      const member = await this.memberRepository.updateMember(memberId, {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        isActive: dto.isActive,
      });

      this.logger.log(`Member updated: ${member.id}`);

      return MemberMapper.toResponseDTO(member, false);
    } catch (error) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_UPDATE_FAILED,
        { MEMBER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.error(`Failed to update member: ${error.message}`);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.MEMBER_UPDATE_FAILED,
      );
    }
  }
}
