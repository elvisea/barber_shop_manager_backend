import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberVerificationTokenSentEvent } from '../events/member-verification-token-sent.event';

import { EmailService } from '@/common/email-service/services/email.service';
import { maskEmail } from '@/common/utils';

/**
 * Listener responsável por processar o evento de token de verificação enviado para membro.
 *
 * Este listener escuta o evento 'member.verification.token.sent' emitido pelos services
 * que enviam tokens de verificação (MemberCreateService, MemberResendVerificationService),
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
      const isResend = !event.tempPassword;

      // Determinar template e assunto baseado no contexto
      const template = isResend
        ? 'email_verification_resend'
        : 'account_creation';

      const subject = isResend
        ? 'Novo Código de Verificação - Barber Shop Manager'
        : 'Bem-vindo ao Barber Shop Manager - Verifique seu Email';

      // Preparar variáveis para o template
      const variables: Record<string, string> = {
        name: event.name,
        token: event.token,
        expiresAt: event.expiresAt,
      };

      // Se houver senha temporária, adicionar ao corpo do email via variável customizada
      // Nota: Os templates atuais não suportam senha temporária, então vamos usar account_creation
      // e adicionar a senha como parte do token ou criar um template específico no futuro
      if (event.tempPassword) {
        // Por enquanto, vamos incluir a senha temporária na mensagem
        // Em uma versão futura, podemos criar um template específico para membros
        variables.token = `${event.token}\n\nSua senha temporária é: ${event.tempPassword}`;
      }

      await this.emailService.send({
        to: event.email,
        subject,
        template: template,
        variables,
      });

      this.logger.log('Member verification email sent successfully', {
        memberId: event.memberId,
        email: event.email,
      });
    } catch (error: unknown) {
      this.logger.error('Failed to send member verification email', {
        memberId: event.memberId,
        email: maskEmail(event.email),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Não re-throw para não quebrar o fluxo principal
      // O email é importante mas não deve impedir a criação do membro
      // O membro foi criado com sucesso mesmo se o email falhar
    }
  }
}
