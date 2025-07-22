import { Injectable, Logger } from '@nestjs/common';

import { WebhookEvent } from '../enums/webhook-event.enum';
import { WebhookLogData } from '../interfaces';

import { EventChatsUpdateService } from './event-chats-update.service';
import { EventMessagesUpsertService } from './event-messages-upsert.service';

import { SubscriptionRepository } from '@/modules/subscriptions/repositories/subscription.repository';

@Injectable()
export class WebhookRouterService {
  private readonly logger = new Logger(WebhookRouterService.name);
  private readonly handlers: Partial<
    Record<WebhookEvent, (payload: WebhookLogData) => Promise<void>>
  > = {};

  constructor(
    private readonly eventMessagesUpsertService: EventMessagesUpsertService,
    private readonly eventChatsUpdateService: EventChatsUpdateService,
    private readonly subscriptionRepository: SubscriptionRepository,
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
    this.logger.log(
      `Received event type ${payload.event} for phone number ${payload.sender}`,
    );

    // Validação de assinatura ativa/paga/não expirada
    const now = new Date();
    const subscription =
      await this.subscriptionRepository.findActivePaidByPhone(
        payload.sender,
        now,
      );

    if (subscription) {
      this.logger.warn(
        `No active/paid subscription found for phone number: ${payload.sender}`,
      );
      return;
    }

    const handler = this.handlers[payload.event];

    if (handler) {
      this.logger.log(`Handler found for event: ${payload.event}`);
      try {
        await handler(payload);
        this.logger.log(`Event ${payload.event} processed successfully.`);
      } catch (err) {
        this.logger.error(`Error processing event ${payload.event}:`, err);
      }
    } else {
      this.logger.warn(`Unknown event or no handler: ${payload.event}`);
    }
  }
}
