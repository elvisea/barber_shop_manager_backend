import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '../events/user-created.event';

/**
 * Listener responsável por processar o evento de usuário criado.
 *
 * Este listener escuta o evento 'user.created' emitido pelo CreateUserService
 * após criar um novo usuário. Por enquanto, apenas loga o evento, pois o email
 * de verificação é enviado via 'user.verification.token.sent'.
 *
 * @example
 * ```typescript
 * // Evento é emitido automaticamente pelo service
 * eventEmitter.emit('user.created', userCreatedEvent);
 * // Este listener processa o evento
 * ```
 */
@Injectable()
export class UserCreatedListener {
  private readonly logger = new Logger(UserCreatedListener.name);

  /**
   * Processa o evento de usuário criado.
   *
   * Este método é chamado automaticamente quando um evento 'user.created'
   * é emitido. Por enquanto, apenas loga o evento, pois o email de verificação
   * é enviado via 'user.verification.token.sent'.
   *
   * @param {UserCreatedEvent} event - Evento de usuário criado
   * @returns {void}
   */
  @OnEvent('user.created')
  handleUserCreated(event: UserCreatedEvent): void {
    this.logger.debug('User created event received', {
      userId: event.userId,
      email: event.email,
    });

    // Por enquanto, apenas logamos. O email de verificação é enviado
    // via 'user.verification.token.sent' event
    this.logger.log('User created successfully', {
      userId: event.userId,
      email: event.email,
    });
  }
}
