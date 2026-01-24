/**
 * Evento emitido quando um token de redefinição de senha é enviado por email.
 *
 * Este evento é emitido pelo RequestPasswordResetService após criar o token de
 * redefinição de senha, permitindo que outros módulos (como EmailsModule) enviem
 * o email de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('password.reset.token.sent', new PasswordResetTokenSentEvent({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   token: '123456',
 *   expiresAt: '31/12/2024 23:59'
 * }));
 * ```
 */
export class PasswordResetTokenSentEvent {
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
   * Token de redefinição de senha
   */
  token: string;

  /**
   * Data de expiração do token formatada
   */
  expiresAt: string;

  constructor(data: {
    userId: string;
    email: string;
    name: string;
    token: string;
    expiresAt: string;
  }) {
    this.userId = data.userId;
    this.email = data.email;
    this.name = data.name;
    this.token = data.token;
    this.expiresAt = data.expiresAt;
  }
}
