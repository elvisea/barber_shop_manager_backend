/**
 * Evento emitido quando um novo membro é criado.
 *
 * Este evento é emitido pelo MemberCreateService após criar um novo membro,
 * permitindo que outros módulos (como EmailsModule) enviem emails de boas-vindas
 * de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('member.created', new MemberCreatedEvent({
 *   memberId: 'member-123',
 *   email: 'member@example.com',
 *   name: 'John Doe',
 *   tempPassword: 'temp123'
 * }));
 * ```
 */
export class MemberCreatedEvent {
  /**
   * ID do membro criado
   */
  memberId: string;

  /**
   * Email do membro
   */
  email: string;

  /**
   * Nome do membro
   */
  name: string;

  /**
   * Senha temporária gerada para o membro
   */
  tempPassword: string;

  constructor(data: {
    memberId: string;
    email: string;
    name: string;
    tempPassword: string;
  }) {
    this.memberId = data.memberId;
    this.email = data.email;
    this.name = data.name;
    this.tempPassword = data.tempPassword;
  }
}
