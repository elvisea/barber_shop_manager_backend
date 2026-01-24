import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { PasswordResetEvent } from '../events/password-reset.event';

import { EmailService } from '@/common/email-service/services/email.service';
import { maskEmail } from '@/common/utils';

/**
 * Listener responsável por processar o evento de senha redefinida.
 *
 * Este listener escuta o evento 'password.reset' emitido pelo ResetPasswordService,
 * e envia o email de confirmação de redefinição de senha de forma desacoplada.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('password.reset', passwordResetEvent);
 * // Este listener processa o evento e envia o email
 * ```
 */
@Injectable()
export class PasswordResetListener {
  private readonly logger = new Logger(PasswordResetListener.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Processa o evento de senha redefinida.
   *
   * Este método é chamado automaticamente quando um evento 'password.reset'
   * é emitido. Envia email de confirmação de redefinição de senha.
   *
   * @param {PasswordResetEvent} event - Evento de senha redefinida
   * @returns {Promise<void>}
   */
  @OnEvent('password.reset')
  async handlePasswordReset(event: PasswordResetEvent): Promise<void> {
    this.logger.debug('Password reset event received', {
      userId: event.userId,
      email: maskEmail(event.email),
    });

    try {
      await this.emailService.send({
        to: event.email,
        subject: 'Senha Redefinida com Sucesso - Barber Shop Manager',
        template: 'password_reset_success',
        variables: {
          name: event.name,
        },
      });

      this.logger.log('Password reset confirmation email sent', {
        userId: event.userId,
        email: maskEmail(event.email),
      });
    } catch (error: unknown) {
      this.logger.error('Failed to send password reset confirmation email', {
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
