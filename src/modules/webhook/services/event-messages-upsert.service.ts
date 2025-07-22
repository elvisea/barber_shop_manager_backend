import { Injectable, Logger } from '@nestjs/common';

import { MessagesUpsertLog } from '../interfaces';

import { MessageBufferService } from './message-buffer.service';

/**
 * ✅ EventMessagesUpsertService - Versão Refatorada
 *
 * Esta versão usa a estrutura centralizada:
 * - Prompt centralizado em BARBER_SHOP_PROMPT
 * - Sistema de buffer centralizado em MessageBufferService
 * - Sem dependência de barberShopFunctions (usa ToolRegistry)
 * - Código mais limpo e reutilizável
 */

@Injectable()
export class EventMessagesUpsertService {
  private readonly logger = new Logger(EventMessagesUpsertService.name);

  constructor(private readonly messageBufferService: MessageBufferService) {
    this.logger.log(
      '[EventMessagesUpsertService] Inicializado com MessageBufferService',
    );
  }

  /**
   * 🎯 Método principal simplificado
   * Delega o processamento para o MessageBufferService
   */
  async handle(payload: MessagesUpsertLog): Promise<void> {
    try {
      this.logger.log(
        `[EventMessagesUpsertService] Processando mensagem: ${payload.data.key.id}`,
      );

      // ✅ Delega para o MessageBufferService que gerencia buffer, IA e envio
      await this.messageBufferService.handleMessage(payload);

      this.logger.log(
        '[EventMessagesUpsertService] Mensagem processada com sucesso',
      );
    } catch (error) {
      this.logger.error(
        '[EventMessagesUpsertService] Erro ao processar mensagem:',
        error,
      );
      throw error; // Re-throw para que o router possa tratar
    }
  }

  /**
   * 📊 Obtém estatísticas dos buffers (delegação)
   */
  getBufferStats() {
    return this.messageBufferService.getBufferStats();
  }

  /**
   * 🧹 Limpa buffers antigos (delegação)
   */
  clearOldBuffers(): void {
    this.messageBufferService.clearOldBuffers();
  }
}
