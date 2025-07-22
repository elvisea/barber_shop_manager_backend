import { Module } from '@nestjs/common';

import { AIModule } from '../ai/ai.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { WebhookController } from './controllers/webhook.controller';
import { EventChatsUpdateService } from './services/event-chats-update.service';
import { EventMessagesUpsertService } from './services/event-messages-upsert.service';
import { MessageBufferService } from './services/message-buffer.service';
import { WebhookRouterService } from './services/webhook-router.service';

@Module({
  imports: [AIModule, SubscriptionsModule],
  controllers: [WebhookController],
  providers: [
    WebhookRouterService,
    EventChatsUpdateService,
    EventMessagesUpsertService,
    MessageBufferService,
  ],
  exports: [
    WebhookRouterService,
    EventChatsUpdateService,
    MessageBufferService,
  ],
})
export class WebhookModule {}
