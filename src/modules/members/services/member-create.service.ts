import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberCreateRequestDTO, MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/shared/establishment-owner-access/establishment-owner-access.service';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class MemberCreateService {
  private readonly logger = new Logger(MemberCreateService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    dto: MemberCreateRequestDTO,
    establishmentId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(
      `Creating member for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Verifica se já existe membro com este email no estabelecimento
    const emailExists =
      await this.memberRepository.existsByEmailAndEstablishment(
        dto.email,
        establishmentId,
      );

    if (emailExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
        { EMAIL: dto.email, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
      );
    }

    // 3. Verifica se já existe membro com este telefone no estabelecimento
    const phoneExists =
      await this.memberRepository.existsByPhoneAndEstablishment(
        dto.phone,
        establishmentId,
      );

    if (phoneExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
        { PHONE: dto.phone, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
      );
    }

    // 4. Gera senha temporária e faz hash
    const tempPassword = generateTempPassword(8);
    const hashedPassword = await hashValue(tempPassword);

    // 5. Cria o membro
    try {
      const member = await this.memberRepository.createMember({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        establishmentId,
      });

      this.logger.log(`Member created with ID: ${member.id}`);

      // TODO: Enviar email com senha temporária para o membro
      this.logger.log(`Temporary password for ${dto.email}: ${tempPassword}`);

      return MemberMapper.toResponseDTO(member, false);
    } catch (error) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_CREATION_FAILED,
        { EMAIL: dto.email, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.error(`Failed to create member: ${error.message}`);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.MEMBER_CREATION_FAILED,
      );
    }
  }
}
