import { Injectable, Logger } from '@nestjs/common';

import { WebhookEvent } from '../enums/webhook-event.enum';
import { WebhookLogData } from '../interfaces';

import { EventChatsUpdateService } from './event-chats-update.service';
import { EventMessagesUpsertService } from './event-messages-upsert.service';

@Injectable()
export class WebhookRouterService {
  private readonly logger = new Logger(WebhookRouterService.name);
  private readonly handlers: Partial<
    Record<WebhookEvent, (payload: WebhookLogData) => Promise<void>>
  > = {};

  constructor(
    private readonly eventMessagesUpsertService: EventMessagesUpsertService,
    private readonly eventChatsUpdateService: EventChatsUpdateService,
  ) {
    // Mapeamento direto de evento para handler
    const eventHandlerMap: Partial<
      Record<WebhookEvent, (payload: WebhookLogData) => Promise<void>>
    > = {
      [WebhookEvent.MESSAGES_UPSERT]: (payload) =>
        this.eventMessagesUpsertService.handle(payload),

      [WebhookEvent.CHATS_UPDATE]: (payload) =>
        this.eventChatsUpdateService.handle(payload),
      // Adicione outros eventos aqui
    };

    // Preencher handlers apenas para eventos definidos no enum
    Object.values(WebhookEvent).forEach((event) => {
      if (eventHandlerMap[event]) {
        this.handlers[event] = eventHandlerMap[event];
      }
    });
  }

  async route(payload: WebhookLogData): Promise<void> {
    const event = payload.event;
    this.logger.log(`[ROUTER] Evento recebido: ${event}`);
    const handler = this.handlers[event];
    if (handler) {
      this.logger.log(`[ROUTER] Handler encontrado para o evento: ${event}`);
      try {
        await handler(payload);
        this.logger.log(`[ROUTER] Evento ${event} processado com sucesso.`);
      } catch (err) {
        this.logger.error(`[ROUTER] Erro ao processar evento ${event}:`, err);
      }
    } else {
      this.logger.warn(
        `[ROUTER] Evento desconhecido ou sem handler: ${payload.event}`,
      );
    }
  }
}
