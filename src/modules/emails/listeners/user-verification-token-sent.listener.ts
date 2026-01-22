import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailService } from '@/email/email.service';
import { getErrorMessage } from '@/common/utils';

import { UserVerificationTokenSentEvent } from '../events/user-verification-token-sent.event';

/**
 * Listener responsável por processar o evento de token de verificação enviado para usuário.
 *
 * Este listener escuta o evento 'user.verification.token.sent' emitido pelos services
 * que enviam tokens de verificação (CreateUserService, UserEmailVerificationResendService),
 * e envia o email de verificação de forma desacoplada.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('user.verification.token.sent', verificationTokenSentEvent);
 * // Este listener processa o evento e envia o email
 * ```
 */
@Injectable()
export class UserVerificationTokenSentListener {
  private readonly logger = new Logger(UserVerificationTokenSentListener.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Processa o evento de token de verificação enviado para usuário.
   *
   * Este método é chamado automaticamente quando um evento 'user.verification.token.sent'
   * é emitido. Envia email com o token de verificação.
   *
   * @param {UserVerificationTokenSentEvent} event - Evento de token de verificação enviado
   * @returns {Promise<void>}
   */
  @OnEvent('user.verification.token.sent')
  async handleUserVerificationTokenSent(
    event: UserVerificationTokenSentEvent,
  ): Promise<void> {
    this.logger.debug('User verification token sent event received', {
      userId: event.userId,
      email: event.email,
    });

    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?code=${event.token}`;

      // Determinar se é um resend baseado no contexto (não temos flag no evento)
      // Por enquanto, usamos o mesmo texto para ambos os casos
      const emailBody = `Hello ${event.name}, your account has been created successfully! Please use the verification code: ${event.token} or click the link: ${verificationUrl}`;

      await this.emailService.sendEmail(
        event.email,
        'Welcome! Please verify your email',
        emailBody,
      );

      this.logger.log('User verification email sent successfully', {
        userId: event.userId,
        email: event.email,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Failed to send user verification email', {
        userId: event.userId,
        email: event.email,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Re-throw para que o erro seja propagado
      // O email de verificação é crítico para o fluxo de criação de usuário
      throw error;
    }
  }
}
