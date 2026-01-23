import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEmailVerification } from '@prisma/client';

import { UserEmailVerificationRepository } from '../repositories/user-email-verification.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserVerificationTokenSentEvent } from '@/modules/emails/events/user-verification-token-sent.event';
import { generateVerificationData } from '@/utils/generate-verification-data';

@Injectable()
export class UserEmailVerificationResendService {
  private readonly logger = new Logger(UserEmailVerificationResendService.name);

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
    private readonly userEmailVerificationRepository: UserEmailVerificationRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    email: string,
    expiresInMinutes: number = UserEmailVerificationResendService.EXPIRATION_MINUTES,
  ): Promise<UserEmailVerification & { plainToken: string }> {
    this.logger.log(`Resending email verification for: ${email}`);

    // Find existing verification by email with user included
    const existingVerificationWithUser =
      await this.userEmailVerificationRepository.findByEmailWithUser(email);

    if (!existingVerificationWithUser) {
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
    if (existingVerificationWithUser.verified) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        { USER_ID: existingVerificationWithUser.userId },
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
      UserEmailVerificationResendService.VERIFICATION_CODE_LENGTH,
    );

    // Update the existing verification with new token and expiration
    const updatedVerification =
      await this.userEmailVerificationRepository.updateTokenAndExpiration(
        existingVerificationWithUser.id,
        {
          token: hashedToken, // Save hashed version
          expiresAt,
        },
      );

    this.logger.log(
      `Email verification resent with new code for user: ${existingVerificationWithUser.userId}`,
    );

    // Usuário já está disponível via relação do Prisma
    const user = existingVerificationWithUser.user;

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
    const verificationTokenSentEvent = new UserVerificationTokenSentEvent({
      userId: user.id,
      email: user.email,
      name: user.name,
      token,
      expiresAt: expiresAtFormatted,
      template: 'email_verification_resend',
    });
    this.eventEmitter.emit(
      'user.verification.token.sent',
      verificationTokenSentEvent,
    );

    this.logger.log(`Verification token event emitted for user: ${user.id}`);

    // Return the updated verification with plain token for email sending
    return {
      ...updatedVerification,
      plainToken: token, // Plain token for email
    };
  }
}
