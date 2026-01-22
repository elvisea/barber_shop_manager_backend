import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EmailService } from '@/email/email.service';
import { getErrorMessage } from '@/common/utils';

import { MemberVerificationTokenSentEvent } from '../events/member-verification-token-sent.event';

/**
 * Listener responsável por processar o evento de token de verificação enviado para membro.
 *
 * Este listener escuta o evento 'member.verification.token.sent' emitido pelos services
 * que enviam tokens de verificação (MemberCreateService, MemberEmailVerificationResendService),
 * e envia o email de verificação de forma desacoplada.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('member.verification.token.sent', verificationTokenSentEvent);
 * // Este listener processa o evento e envia o email
 * ```
 */
@Injectable()
export class MemberVerificationTokenSentListener {
  private readonly logger = new Logger(
    MemberVerificationTokenSentListener.name,
  );

  constructor(private readonly emailService: EmailService) {}

  /**
   * Processa o evento de token de verificação enviado para membro.
   *
   * Este método é chamado automaticamente quando um evento 'member.verification.token.sent'
   * é emitido. Envia email com o token de verificação e senha temporária (se aplicável).
   *
   * @param {MemberVerificationTokenSentEvent} event - Evento de token de verificação enviado
   * @returns {Promise<void>}
   */
  @OnEvent('member.verification.token.sent')
  async handleMemberVerificationTokenSent(
    event: MemberVerificationTokenSentEvent,
  ): Promise<void> {
    this.logger.debug('Member verification token sent event received', {
      memberId: event.memberId,
      email: event.email,
    });

    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-member-email?code=${event.token}`;

      const isResend = !event.tempPassword;

      let emailBody = `Olá ${event.name}!\n\n`;

      if (isResend) {
        emailBody += `Você solicitou um novo código de verificação de email.\n\n`;
      } else {
        emailBody += `Bem-vindo à nossa barbearia! Para começar a usar sua conta, você precisa verificar seu email.\n\n`;
      }

      emailBody += `Seu código de verificação é: ${event.token}\n\n`;
      emailBody += `Ou clique no link: ${verificationUrl}\n\n`;

      if (event.tempPassword) {
        emailBody += `Sua senha temporária é: ${event.tempPassword}\n\n`;
      }

      emailBody += `Este código expira em 24 horas.\n\n`;
      emailBody += `Atenciosamente,\nEquipe da Barbearia`;

      const subject = isResend
        ? 'Novo código de verificação de email - Membro'
        : 'Bem-vindo! Verifique seu email - Barbearia';

      await this.emailService.sendEmail(event.email, subject, emailBody);

      this.logger.log('Member verification email sent successfully', {
        memberId: event.memberId,
        email: event.email,
      });
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      this.logger.error('Failed to send member verification email', {
        memberId: event.memberId,
        email: event.email,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Não re-throw para não quebrar o fluxo principal
      // O email é importante mas não deve impedir a criação do membro
      // O membro foi criado com sucesso mesmo se o email falhar
    }
  }
}
