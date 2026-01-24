/**
 * Evento emitido quando uma senha é redefinida com sucesso.
 *
 * Este evento é emitido pelo ResetPasswordService após redefinir a senha do usuário,
 * permitindo que outros módulos (como EmailsModule) enviem email de confirmação
 * de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('password.reset', new PasswordResetEvent({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * }));
 * ```
 */
export class PasswordResetEvent {
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

  constructor(data: { userId: string; email: string; name: string }) {
    this.userId = data.userId;
    this.email = data.email;
    this.name = data.name;
  }
}
