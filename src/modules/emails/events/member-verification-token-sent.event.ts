/**
 * Evento emitido quando um token de verificação é enviado por email para um membro.
 *
 * Este evento é emitido pelos services que enviam tokens de verificação
 * (MemberCreateService, MemberEmailVerificationResendService), permitindo que outros módulos
 * (como EmailsModule) enviem o email de forma desacoplada.
 *
 * @example
 * ```typescript
 * eventEmitter.emit('member.verification.token.sent', new MemberVerificationTokenSentEvent({
 *   memberId: 'member-123',
 *   email: 'member@example.com',
 *   name: 'John Doe',
 *   token: '123456',
 *   expiresAt: '31/12/2024 23:59',
 *   tempPassword: 'temp123'
 * }));
 * ```
 */
export class MemberVerificationTokenSentEvent {
  /**
   * ID do membro
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
   * Token de verificação
   */
  token: string;

  /**
   * Data de expiração do token formatada
   */
  expiresAt: string;

  /**
   * Senha temporária gerada para o membro
   */
  tempPassword?: string;

  constructor(data: {
    memberId: string;
    email: string;
    name: string;
    token: string;
    expiresAt: string;
    tempPassword?: string;
  }) {
    this.memberId = data.memberId;
    this.email = data.email;
    this.name = data.name;
    this.token = data.token;
    this.expiresAt = data.expiresAt;
    this.tempPassword = data.tempPassword;
  }
}
