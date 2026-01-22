/**
 * Evento emitido quando um novo usuário é criado.
 *
 * Este evento é emitido pelo CreateUserService após criar um novo usuário,
 * permitindo que outros módulos (como EmailsModule) enviem emails de boas-vindas
 * de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('user.created', new UserCreatedEvent({
 *   userId: 'user-123',
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * }));
 * ```
 */
export class UserCreatedEvent {
  /**
   * ID do usuário criado
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
