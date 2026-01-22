import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MemberCreatedEvent } from '../events/member-created.event';

/**
 * Listener responsável por processar o evento de membro criado.
 *
 * Este listener escuta o evento 'member.created' emitido pelo MemberCreateService
 * após criar um novo membro. Por enquanto, apenas loga o evento, pois o email
 * de verificação é enviado via 'member.verification.token.sent'.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('member.created', memberCreatedEvent);
 * // Este listener processa o evento
 * ```
 */
@Injectable()
export class MemberCreatedListener {
  private readonly logger = new Logger(MemberCreatedListener.name);

  /**
   * Processa o evento de membro criado.
   *
   * Este método é chamado automaticamente quando um evento 'member.created'
   * é emitido. Por enquanto, apenas loga o evento, pois o email de verificação
   * é enviado via 'member.verification.token.sent'.
   *
   * @param {MemberCreatedEvent} event - Evento de membro criado
   * @returns {void}
   */
  @OnEvent('member.created')
  handleMemberCreated(event: MemberCreatedEvent): void {
    this.logger.debug('Member created event received', {
      memberId: event.memberId,
      email: event.email,
    });

    // Por enquanto, apenas logamos. O email de verificação é enviado
    // via 'member.verification.token.sent' event
    this.logger.log('Member created successfully', {
      memberId: event.memberId,
      email: event.email,
    });
  }
}
