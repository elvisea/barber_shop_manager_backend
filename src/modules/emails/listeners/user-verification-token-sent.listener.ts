import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserVerificationTokenSentEvent } from '../events/user-verification-token-sent.event';

import { EmailService } from '@/common/email-service/services/email.service';
import { maskEmail } from '@/common/utils';

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
      email: maskEmail(event.email),
      template: event.template,
    });

    try {
      // Determinar assunto do email baseado no template
      let emailSubject: string;

      switch (event.template) {
        case 'account_creation':
          emailSubject =
            'Bem-vindo ao Barber Shop Manager - Verifique seu Email';
          break;
        case 'account_creation_existing':
          emailSubject = 'Verifique seu Email - Barber Shop Manager';
          break;
        case 'email_verification_resend':
          emailSubject = 'Novo Código de Verificação - Barber Shop Manager';
          break;
        default:
          emailSubject = 'Verifique seu Email - Barber Shop Manager';
      }

      await this.emailService.send({
        to: event.email,
        subject: emailSubject,
        template: event.template,
        variables: {
          name: event.name,
          token: event.token,
          expiresAt: event.expiresAt,
        },
      });

      this.logger.log('User verification email sent successfully', {
        userId: event.userId,
        email: maskEmail(event.email),
        template: event.template,
      });
    } catch (error: unknown) {
      this.logger.error('Failed to send user verification email', {
        userId: event.userId,
        email: maskEmail(event.email),
        template: event.template,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Re-throw para que o erro seja propagado
      // O email de verificação é crítico para o fluxo de criação de usuário
      throw error;
    }
  }
}
