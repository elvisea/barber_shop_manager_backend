import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO, MemberUpdateRequestDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

@Injectable()
export class MemberUpdateService {
  private readonly logger = new Logger(MemberUpdateService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    memberId: string,
    dto: MemberUpdateRequestDTO,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(`Updating member ${memberId} by user ${requesterId}`);

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
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_UPDATE_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to update member',
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
