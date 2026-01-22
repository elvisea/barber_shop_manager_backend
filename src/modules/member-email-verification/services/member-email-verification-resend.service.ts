import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MemberEmailVerification } from '@prisma/client';

import { MemberEmailVerificationRepository } from '../repositories/member-email-verification.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberVerificationTokenSentEvent } from '@/modules/emails/events/member-verification-token-sent.event';
import { generateVerificationData } from '@/utils/generate-verification-data';

@Injectable()
export class MemberEmailVerificationResendService {
  private readonly logger = new Logger(
    MemberEmailVerificationResendService.name,
  );

  /**
   * Comprimento do código de verificação em dígitos.
   * Gera códigos de 6 dígitos (ex: 123456, 789012).
   */
  private static readonly VERIFICATION_CODE_LENGTH = 6;

  /**
   * Tempo de expiração da verificação em minutos.
   * 24 horas = 1440 minutos.
   */
  private static readonly EXPIRATION_MINUTES = 1440;

  constructor(
    private readonly memberEmailVerificationRepository: MemberEmailVerificationRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    email: string,
    expiresInMinutes: number = MemberEmailVerificationResendService.EXPIRATION_MINUTES,
  ): Promise<MemberEmailVerification & { plainToken: string }> {
    this.logger.log(`Resending member email verification for: ${email}`);

    // Find existing verification by email with member included
    const existingVerificationWithMember =
      await this.memberEmailVerificationRepository.findByEmailWithMember(email);

    if (!existingVerificationWithMember) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND,
        { EMAIL: email },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND,
      );
    }

    // Check if already verified
    if (existingVerificationWithMember.verified) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        { USER_ID: existingVerificationWithMember.memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_VERIFIED,
      );
    }

    // Generate new verification data with hashed token
    const { token, hashedToken, expiresAt } = await generateVerificationData(
      expiresInMinutes,
      MemberEmailVerificationResendService.VERIFICATION_CODE_LENGTH,
    );

    // Update the existing verification with new token and expiration
    const updatedVerification =
      await this.memberEmailVerificationRepository.updateTokenAndExpiration(
        existingVerificationWithMember.id,
        {
          token: hashedToken, // Save hashed version
          expiresAt,
        },
      );

    this.logger.log(
      `Member email verification resent with new code for member: ${existingVerificationWithMember.memberId}`,
    );

    // Membro já está disponível via relação do Prisma
    const member = existingVerificationWithMember.member;

    // Formatar data de expiração no formato brasileiro
    const expiresAtFormatted = expiresAt.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo',
    });

    // Emitir evento de token de verificação enviado
    const verificationTokenSentEvent = new MemberVerificationTokenSentEvent({
      memberId: member.id,
      email: member.email,
      name: member.name,
      token,
      expiresAt: expiresAtFormatted,
      // Não incluir tempPassword no resend, pois não é um novo membro
    });
    this.eventEmitter.emit(
      'member.verification.token.sent',
      verificationTokenSentEvent,
    );

    this.logger.log(
      `Verification token event emitted for member: ${member.id}`,
    );

    // Return the updated verification with plain token for email sending
    return {
      ...updatedVerification,
      plainToken: token, // Plain token for email
    };
  }
}
