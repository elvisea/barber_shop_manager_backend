/**
 * Evento emitido quando um token de verificação é enviado por email para um usuário.
 *
 * Este evento é emitido pelos services que enviam tokens de verificação
 * (CreateUserService, ResendVerificationService), permitindo que outros módulos
 * (como EmailsModule) enviem o email de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('user.verification.token.sent', new UserVerificationTokenSentEvent({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   token: '123456',
 *   expiresAt: '31/12/2024 23:59',
 *   template: 'account_creation'
 * }));
 * ```
 */
export class UserVerificationTokenSentEvent {
  /**
   * ID do usuário
   */
  userId: string;

  /**
   * Email do usuário
   */
  email: string;

  /**
   * Nome do usuário
   */
  name: string;

  /**
   * Token de verificação
   */
  token: string;

  /**
   * Data de expiração do token formatada
   */
  expiresAt: string;

  /**
   * Template do email a ser usado
   */
  template:
    | 'account_creation'
    | 'account_creation_existing'
    | 'email_verification_resend';

  constructor(data: {
    userId: string;
    email: string;
    name: string;
    token: string;
    expiresAt: string;
    template:
      | 'account_creation'
      | 'account_creation_existing'
      | 'email_verification_resend';
  }) {
    this.userId = data.userId;
    this.email = data.email;
    this.name = data.name;
    this.token = data.token;
    this.expiresAt = data.expiresAt;
    this.template = data.template;
  }
}
