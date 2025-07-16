import { Module } from '@nestjs/common';

import { WebhookController } from './controllers/webhook.controller';
import { EventChatsUpdateService } from './services/event-chats-update.service';
import { EventMessagesUpsertService } from './services/event-messages-upsert.service';
import { WebhookRouterService } from './services/webhook-router.service';

@Module({
  controllers: [WebhookController],
  providers: [
    WebhookRouterService,
    EventMessagesUpsertService,
    EventChatsUpdateService,
  ],
  exports: [
    WebhookRouterService,
    EventMessagesUpsertService,
    EventChatsUpdateService,
  ],
})
export class WebhookModule {}
