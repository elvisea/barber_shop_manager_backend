import { Injectable, Logger } from '@nestjs/common';

import { ChatsUpdateLog } from '../interfaces';

@Injectable()
export class EventChatsUpdateService {
  private readonly logger = new Logger(EventChatsUpdateService.name);

  handle(payload: ChatsUpdateLog): Promise<void> {
    this.logger.log(
      '[EventChatsUpdateService] Starting processing of chats.update event',
    );
    try {
      const chatData = payload?.data;
      this.logger.log(
        `[EventChatsUpdateService] Chat data: ${JSON.stringify(chatData)}`,
      );
      // Here you can add persistence logic, notification, etc.
      this.logger.log(
        '[EventChatsUpdateService] Processing completed successfully.',
      );
      return Promise.resolve();
    } catch (err) {
      this.logger.error(
        '[EventChatsUpdateService] Error processing event:',
        err,
      );
      return Promise.reject(err);
    }
  }
}
