import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberCreateRequestDTO, MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';
import { MemberEmailVerificationCreateService } from '@/modules/member-email-verification/services/member-email-verification-create.service';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class MemberCreateService {
  private readonly logger = new Logger(MemberCreateService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
    private readonly memberEmailVerificationCreateService: MemberEmailVerificationCreateService,
    private readonly emailService: EmailService,
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

    // 2. Verifica se já existe membro com este email globalmente
    const emailExists = await this.memberRepository.existsByEmail(dto.email);

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

    // 3. Verifica se já existe membro com este telefone globalmente
    const phoneExists = await this.memberRepository.existsByPhone(dto.phone);

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

      // 6. Cria verificação de email e envia código
      try {
        const verification = await this.memberEmailVerificationCreateService.execute(
          member.id,
          dto.email,
        );

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-member-email?code=${verification.plainToken}`;

        await this.emailService.sendEmail(
          dto.email,
          'Bem-vindo! Verifique seu email - Barbearia',
          `Olá ${dto.name}!\n\n` +
          `Bem-vindo à nossa barbearia! Para começar a usar sua conta, você precisa verificar seu email.\n\n` +
          `Seu código de verificação é: ${verification.plainToken}\n\n` +
          `Ou clique no link: ${verificationUrl}\n\n` +
          `Sua senha temporária é: ${tempPassword}\n\n` +
          `Este código expira em 24 horas.\n\n` +
          `Atenciosamente,\nEquipe da Barbearia`,
        );

        this.logger.log(`Verification email sent successfully to: ${dto.email}`);
      } catch (emailError) {
        this.logger.error(
          `Failed to send verification email to ${dto.email}: ${emailError.message}`,
        );
        // Don't throw error here, just log it
        // The member was still created successfully
      }

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
