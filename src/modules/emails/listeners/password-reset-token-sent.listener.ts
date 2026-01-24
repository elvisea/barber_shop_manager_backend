import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PasswordResetTokenSentEvent } from '../events/password-reset-token-sent.event';

import { EmailService } from '@/common/email-service/services/email.service';
import { maskEmail } from '@/common/utils';

/**
 * Listener responsável por processar o evento de token de redefinição de senha enviado.
 *
 * Este listener escuta o evento 'password.reset.token.sent' emitido pelo RequestPasswordResetService,
 * e envia o email de redefinição de senha de forma desacoplada.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('password.reset.token.sent', passwordResetTokenSentEvent);
 * // Este listener processa o evento e envia o email
 * ```
 */
@Injectable()
export class PasswordResetTokenSentListener {
  private readonly logger = new Logger(PasswordResetTokenSentListener.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Processa o evento de token de redefinição de senha enviado.
   *
   * Este método é chamado automaticamente quando um evento 'password.reset.token.sent'
   * é emitido. Envia email com o token de redefinição de senha.
   *
   * @param {PasswordResetTokenSentEvent} event - Evento de token de redefinição de senha enviado
   * @returns {Promise<void>}
   */
  @OnEvent('password.reset.token.sent')
  async handlePasswordResetTokenSent(
    event: PasswordResetTokenSentEvent,
  ): Promise<void> {
    this.logger.debug('Password reset token sent event received', {
      userId: event.userId,
      email: maskEmail(event.email),
    });

    try {
      await this.emailService.send({
        to: event.email,
        subject: 'Redefinição de Senha - Barber Shop Manager',
        template: 'password_reset',
        variables: {
          name: event.name,
          token: event.token,
          expiresAt: event.expiresAt,
        },
      });

      this.logger.log('Password reset email sent successfully', {
        userId: event.userId,
        email: maskEmail(event.email),
      });
    } catch (error: unknown) {
      this.logger.error('Failed to send password reset email', {
        userId: event.userId,
        email: maskEmail(event.email),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Não re-throw aqui para não quebrar o fluxo de reset de senha
      // O email não é crítico para o processo, apenas informativo
    }
  }
}
