import { Injectable, Logger } from '@nestjs/common';
import { ChatsUpdateLog } from '../interfaces';

@Injectable()
export class EventChatsUpdateService {
  private readonly logger = new Logger(EventChatsUpdateService.name);

  async handle(payload: ChatsUpdateLog): Promise<void> {
    this.logger.log(
      '[EventChatsUpdateService] Iniciando processamento do evento chats.update',
    );
    try {
      const chatData = payload?.data;
      this.logger.log(
        `[EventChatsUpdateService] Dados do chat: ${JSON.stringify(chatData)}`,
      );
      // Aqui você pode adicionar lógica de persistência, notificação, etc.
      this.logger.log(
        '[EventChatsUpdateService] Processamento concluído com sucesso.',
      );
    } catch (err) {
      this.logger.error(
        '[EventChatsUpdateService] Erro ao processar evento:',
        err,
      );
      throw err;
    }
  }
}
