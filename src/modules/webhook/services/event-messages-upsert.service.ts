import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { MessagesUpsertLog } from '../interfaces';

import { HttpClientService } from '@/http-client/http-client.service';
import { AIProviderFactoryService } from '@/modules/ai/services/ai-provider-factory.service';
import { ToolRegistryService } from '@/modules/ai/tools/registry/tool-registry';

/**
 * 📨 Interface para resposta da API de busca de mensagens
 */
export interface FindMessagesResponse {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: MessageRecord[];
  };
}

/**
 * 📝 Interface para registro de mensagem individual
 */
export interface MessageRecord {
  id: string;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid: string;
  };
  pushName: string;
  messageType: string;
  message: {
    conversation: string;
  };
  messageTimestamp: number;
  instanceId: string;
  source: string;
  contextInfo: any | null;
  MessageUpdate: Array<{
    status: string;
  }>;
}

/**
 * 📦 Estrutura para controlar o buffer de mensagens por usuário
 */
interface MessageBuffer {
  timer: NodeJS.Timeout | null;
  lastMessageTime: number;
  lastMessage: string;
  lastPayload: MessagesUpsertLog | null;
}

/**
 * EventMessagesUpsertService - Serviço centralizado de processamento de mensagens do webhook
 *
 * RESPONSABILIDADES:
 * - Orquestrar o fluxo de mensagens recebidas do webhook (WhatsApp)
 * - Gerenciar buffer/debounce por usuário
 * - Integrar com IA (function calling, tools)
 * - Executar tools e enviar respostas finais para o usuário
 *
 * FLUXO PRINCIPAL:
 * 1. Recebe mensagem do webhook
 * 2. Armazena no buffer do usuário
 * 3. Após timeout de inatividade, processa a mensagem
 * 4. Busca histórico/contexto
 * 5. Chama a IA (com tools)
 * 6. Executa tools se necessário
 * 7. Envia resposta final para o WhatsApp
 *
 * INTEGRAÇÃO COM FUNCTION CALLING:
 * - Detecta tool calls na resposta da IA
 * - Executa as tools e envia o resultado de volta para a IA
 * - Garante que a resposta final ao usuário seja sempre a mais atualizada
 *
 * EXEMPLO DE USO:
 * - O serviço é chamado pelo controller/router do webhook ao receber uma nova mensagem
 *
 * @see documentação dos providers de IA para detalhes de integração
 */
@Injectable()
export class EventMessagesUpsertService {
  private readonly logger = new Logger(EventMessagesUpsertService.name);

  // Buffer de mensagens por usuário (remoteJid)
  private readonly messageBuffers: Record<string, MessageBuffer> = {};

  // Tempo de inatividade (ms) para considerar que o usuário terminou de digitar
  private readonly USER_INACTIVITY_TIMEOUT_MS = 10000;

  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly configService: ConfigService,
    private readonly toolRegistry: ToolRegistryService,
    private readonly aiProviderFactory: AIProviderFactoryService,
  ) {
    this.logger.log(
      `[EventMessagesUpsertService] ✅ Inicializado com timeout de ${this.USER_INACTIVITY_TIMEOUT_MS}ms`,
    );
  }

  /**
   * 🎯 PONTO DE ENTRADA - Recebe mensagem do webhook
   *
   * FLUXO:
   * 1. Extrai dados da mensagem
   * 2. Adiciona ao buffer do usuário
   * 3. Configura timer de inatividade
   * 4. Após timeout, chama processBufferWithNewFlow()
   *
   * @param payload Mensagem recebida do webhook
   */
  async handle(payload: MessagesUpsertLog): Promise<void> {
    try {
      const { remoteJid, message } = this.extractDataPayload(payload);

      this.logger.log(
        `📨 [ENTRADA] Mensagem recebida de ${remoteJid}: "${message}"`,
      );

      // Inicializar buffer se não existir
      if (!this.messageBuffers[remoteJid]) {
        this.messageBuffers[remoteJid] = {
          timer: null,
          lastMessageTime: Date.now(),
          lastMessage: message,
          lastPayload: payload,
        };
        this.logger.log(`🆕 [BUFFER] Novo buffer criado para ${remoteJid}`);
      }

      const buffer = this.messageBuffers[remoteJid];

      // Adicionar mensagem ao buffer
      buffer.lastMessage = message;
      buffer.lastMessageTime = Date.now();
      buffer.lastPayload = payload;

      this.logger.log(`📥 [BUFFER] Mensagem atualizada: "${message}"`);

      // Limpar timer anterior, se existir
      if (buffer.timer) {
        clearTimeout(buffer.timer);
        this.logger.log(
          `⏰ [TIMER] Timer anterior cancelado para ${remoteJid}`,
        );
      }

      // Configurar novo timer para processar após inatividade
      buffer.timer = setTimeout(async () => {
        this.logger.log(
          `⏰ [TIMER] Timeout atingido para ${remoteJid}. Processando buffer...`,
        );
        await this.processBufferWithNewFlow(remoteJid, buffer.lastPayload);
      }, this.USER_INACTIVITY_TIMEOUT_MS);

      this.logger.log(
        `⏰ [TIMER] Novo timer configurado para ${remoteJid} (${this.USER_INACTIVITY_TIMEOUT_MS}ms)`,
      );

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
   * 🔄 PROCESSAMENTO PRINCIPAL - Executa após timeout de inatividade
   *
   * FLUXO:
   * 1. Obtém mensagem atual do buffer
   * 2. Busca histórico de conversas (excluindo mensagem atual)
   * 3. Obtém tools disponíveis
   * 4. Envia para IA com function calling
   * 5. Executa tools se necessário
   * 6. Envia resposta final
   *
   * @param remoteJid Identificador do usuário
   * @param lastPayload Último payload recebido
   */
  private async processBufferWithNewFlow(
    remoteJid: string,
    lastPayload: MessagesUpsertLog | null,
  ): Promise<void> {
    const buffer = this.messageBuffers[remoteJid];
    if (!buffer) {
      this.logger.warn(`⚠️ [BUFFER] Buffer não encontrado para ${remoteJid}`);
      return;
    }

    // Concatenar todas as mensagens do buffer
    const fullText = buffer.lastMessage.trim();

    this.logger.log(
      `🔄 [PROCESSAMENTO] Iniciando processamento para ${remoteJid}`,
    );
    this.logger.log(`📝 [TEXTO] Texto completo: "${fullText}"`);

    if (!lastPayload) {
      this.logger.error(`❌ [ERRO] Payload não encontrado para ${remoteJid}`);
      return;
    }

    const { instance, apikey } = lastPayload;

    try {
      // 1. Obter tools disponíveis
      const tools = this.toolRegistry.getChatCompletionTools();
      this.logger.log(`🔧 [TOOLS] Tools disponíveis: ${tools.length}`);
      this.logger.log(
        `🔧 [TOOLS] Lista: ${tools.map((t) => t.function.name).join(', ')}`,
      );

      // 2. Buscar histórico de mensagens do usuário
      this.logger.log(`📚 [HISTÓRICO] Buscando contexto para ${remoteJid}`);
      const contextMessages = await this.getContextMessages({
        apikey,
        instance,
        remoteJid,
        excludeMessages: [fullText], // Excluir mensagem atual do buffer
      });
      this.logger.log(
        `📚 [HISTÓRICO] Encontrado: ${contextMessages.length} mensagens`,
      );

      // Limpar buffer após obter histórico
      buffer.lastMessage = '';
      buffer.lastPayload = null;
      buffer.timer = null;
      this.logger.log(`🧹 [BUFFER] Buffer limpo para ${remoteJid}`);

      // 3. Construir mensagens para a IA
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content:
            'Você é Luna, uma assistente de barbearia. Sempre que o usuário pedir para listar, buscar ou criar planos, utilize as funções disponíveis (tools) para obter a resposta. Nunca responda diretamente sem consultar as funções. Se não houver função adequada, apenas informe que não é possível responder.',
        },
        ...contextMessages, // Adicionar histórico de mensagens
        {
          role: 'user',
          content: fullText, // Usar texto completo do buffer
        },
      ];

      this.logger.log('📤 [IA] Enviando mensagem para IA...');
      this.logger.log(
        '📤 [IA] Mensagens para IA:',
        JSON.stringify(messages, null, 2),
      );

      // 4. Chamar a IA com function calling
      const aiProvider = this.aiProviderFactory.getProvider();
      const response = await aiProvider.generateResponse(messages, tools);

      this.logger.log(
        '📥 [IA] Resposta completa da IA:',
        JSON.stringify(response, null, 2),
      );

      // 5. Verificar se há tool calls
      if (response.tool_calls && response.tool_calls.length > 0) {
        this.logger.log(
          `🔧 [TOOLS] Tool calls detectados: ${response.tool_calls.length}`,
        );

        // Adiciona a resposta original (com tool_calls) ao histórico ANTES de processar
        messages.push(response);

        // Executar todas as tools em paralelo (se possível)
        const toolResults = await Promise.all(
          response.tool_calls.map(async (toolCall) => {
            try {
              this.logger.log(
                `🔧 [TOOL] Executando tool: ${toolCall.function.name}`,
              );
              this.logger.log(
                `🔧 [TOOL] Argumentos: ${toolCall.function.arguments}`,
              );

              // Segurança: só executa se a tool está registrada
              if (!this.toolRegistry.hasTool(toolCall.function.name)) {
                throw new Error(
                  `Tool não permitida: ${toolCall.function.name}`,
                );
              }

              // Parse dos argumentos
              const args = JSON.parse(toolCall.function.arguments);

              // Validação básica dos argumentos
              if (!args) {
                throw new Error(
                  `Argumentos inválidos para tool ${toolCall.function.name}`,
                );
              }

              this.logger.log(
                `🔧 [TOOL] Argumentos parseados:`,
                JSON.stringify(args, null, 2),
              );

              // Executar a tool
              const result = await this.toolRegistry.executeTool(
                toolCall.function.name,
                args,
              );

              this.logger.log(
                `🔧 [TOOL] Resultado da tool ${toolCall.function.name}:`,
                JSON.stringify(result, null, 2),
              );

              // Padroniza retorno: sempre JSON string
              return {
                tool_call_id: toolCall.id,
                content:
                  typeof result.data === 'string'
                    ? result.data
                    : JSON.stringify(result.data),
                success: !!result.success,
                tool: toolCall.function.name,
              };
            } catch (error) {
              this.logger.error(`❌ [TOOL] Erro executando tool:`, error);
              return {
                tool_call_id: toolCall.id,
                content: `Erro executando ${toolCall.function.name}: ${error.message}`,
                success: false,
                tool: toolCall.function.name,
              };
            }
          }),
        );

        // Adicionar todos os resultados ao histórico
        toolResults.forEach((result) => {
          messages.push({
            role: 'tool',
            tool_call_id: result.tool_call_id,
            content: result.content,
          });
        });

        // 8. Chamar a IA novamente com o resultado da tool
        this.logger.log(
          '🔄 [IA] Chamando IA novamente com resultado das tools...',
        );
        this.logger.log(
          '🔄 [IA] Mensagens para segunda chamada:',
          JSON.stringify(messages, null, 2),
        );

        const finalResponse = await aiProvider.generateResponse(messages);

        this.logger.log(
          '📥 [IA] Resposta final da IA:',
          JSON.stringify(finalResponse, null, 2),
        );

        // RECOMENDAÇÃO IMPORTANTE:
        // Sempre utilize como resposta final as mensagens geradas pelas tools (function calling).
        // Nunca utilize o histórico de mensagens como resposta final, pois podem conter informações desatualizadas.
        // Priorize SEMPRE o resultado das tools para garantir informações atualizadas e corretas ao usuário.
        await this.sendMessage(
          instance,
          apikey,
          remoteJid,
          finalResponse.content ||
            'Desculpe, não consegui processar sua mensagem.',
        );
      } else {
        // 10. Se não há tool calls, enviar resposta direta
        this.logger.log('💬 [IA] Sem tool calls - enviando resposta direta');
        await this.sendMessage(
          instance,
          apikey,
          remoteJid,
          response.content || 'Desculpe, não consegui processar sua mensagem.',
        );
      }

      this.logger.log(
        `✅ [PROCESSAMENTO] Concluído com sucesso para ${remoteJid}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ [ERRO] Erro ao processar buffer para ${remoteJid}:`,
        error,
      );

      // Enviar mensagem de erro
      try {
        await this.sendMessage(
          instance,
          apikey,
          remoteJid,
          'Desculpe, ocorreu um erro ao processar sua mensagem.',
        );
      } catch (sendError) {
        this.logger.error(
          '❌ [ERRO] Erro ao enviar mensagem de erro:',
          sendError,
        );
      }
    }
  }

  /**
   * 📚 HISTÓRICO DE CONVERSAS - Busca mensagens anteriores
   *
   * @param remoteJid Identificador do usuário
   * @param instance Instância do WhatsApp
   * @param apikey Chave da API
   * @param excludeMessages Mensagens do buffer para excluir do histórico
   * @returns Array de mensagens do histórico
   */
  private async getContextMessages({
    remoteJid,
    instance,
    apikey,
    excludeMessages = [],
  }: {
    remoteJid: string;
    instance: string;
    apikey: string;
    excludeMessages?: string[];
  }): Promise<ChatCompletionMessageParam[]> {
    const apiUrl = this.configService.get<string>(
      'EVOLUTION_API_URL',
      'http://api:8080',
    );
    const findMessagesUrl = `${apiUrl}/chat/findMessages/${instance}`;

    this.logger.log(`📚 [HISTÓRICO] Buscando em: ${findMessagesUrl}`);
    this.logger.log(
      `📚 [HISTÓRICO] Excluindo ${excludeMessages.length} mensagens do buffer`,
    );

    const findMessagesBody = {
      where: {
        key: {
          remoteJid,
        },
      },
      page: 1,
      offset: 10,
    };

    try {
      const response =
        await this.httpClientService.request<FindMessagesResponse>(
          findMessagesUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey,
            },
            data: findMessagesBody,
          },
        );

      this.logger.log(
        `📚 [HISTÓRICO] Total de mensagens encontradas: ${response.messages.total}`,
      );

      const history: ChatCompletionMessageParam[] = response.messages.records
        .map((record: MessageRecord) => {
          return {
            role: record.key.fromMe ? 'assistant' : 'user',
            content: record.message?.conversation || '',
          };
        })
        .filter((msg) => msg.content && msg.content.trim().length > 0)
        .filter((msg) => {
          // Excluir mensagens que estão no buffer atual
          return !excludeMessages.some(
            (excludeMsg) =>
              msg.content.trim().toLowerCase() ===
              excludeMsg.trim().toLowerCase(),
          );
        })
        .slice(-5) as ChatCompletionMessageParam[];

      this.logger.log(
        `📚 [HISTÓRICO] Mensagens após filtros: ${history.length}`,
      );
      this.logger.log(
        `📚 [HISTÓRICO] Conteúdo:`,
        JSON.stringify(history, null, 2),
      );

      return history;
    } catch (err) {
      this.logger.error('❌ [HISTÓRICO] Erro ao buscar contexto:', err);
    }

    return [];
  }

  /**
   * 📤 ENVIO DE MENSAGEM - Envia resposta para WhatsApp
   *
   * @param instance Instância do WhatsApp
   * @param apikey Chave da API
   * @param remoteJid Identificador do usuário
   * @param text Texto da mensagem
   */
  private async sendMessage(
    instance: string,
    apikey: string,
    remoteJid: string,
    text: string,
  ): Promise<void> {
    const apiUrl =
      this.configService.get<string>('EVOLUTION_API_URL') || 'http://api:8080';
    const url = `${apiUrl}/message/sendText/${instance}`;

    this.logger.log(`📤 [WHATSAPP] Enviando para: ${url}`);
    this.logger.log(`📤 [WHATSAPP] Texto: "${text}"`);

    const number = remoteJid.replace(/[^0-9]/g, '');

    try {
      const response = await this.httpClientService.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey,
        },
        data: {
          number,
          text,
        },
      });

      this.logger.log(
        `✅ [WHATSAPP] Mensagem enviada com sucesso para ${number}`,
      );

      this.logger.log(`✅ [WHATSAPP] Resposta da API:`, response);
    } catch (error) {
      this.logger.error('❌ [WHATSAPP] Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * 🧹 LIMPEZA AUTOMÁTICA - Remove buffers antigos
   */
  clearOldBuffers(): void {
    const now = Date.now();
    let clearedCount = 0;

    for (const [remoteJid, buffer] of Object.entries(this.messageBuffers)) {
      // Se o buffer está inativo há mais que 2x o timeout, limpar
      if (now - buffer.lastMessageTime > this.USER_INACTIVITY_TIMEOUT_MS * 2) {
        if (buffer.timer) {
          clearTimeout(buffer.timer);
        }
        delete this.messageBuffers[remoteJid];
        clearedCount++;
      }
    }

    if (clearedCount > 0) {
      this.logger.log(`🧹 [LIMPEZA] ${clearedCount} buffers antigos removidos`);
    }
  }

  /**
   * 📊 ESTATÍSTICAS - Obtém informações dos buffers
   *
   * @returns Estatísticas dos buffers ativos
   */
  getBufferStats(): { totalBuffers: number; activeBuffers: number } {
    const totalBuffers = Object.keys(this.messageBuffers).length;
    const activeBuffers = Object.values(this.messageBuffers).filter(
      (buffer) => buffer.timer !== null,
    ).length;

    this.logger.log(
      `📊 [STATS] Total: ${totalBuffers}, Ativos: ${activeBuffers}`,
    );

    return { totalBuffers, activeBuffers };
  }

  /**
   * 🔧 EXTRAÇÃO DE DADOS - Extrai informações do payload
   *
   * @param payload Payload recebido do webhook
   * @returns Dados extraídos
   */
  private extractDataPayload(payload: MessagesUpsertLog): {
    remoteJid: string;
    message: string;
    instance: string;
    apikey: string;
  } {
    const remoteJid = payload.data.key.remoteJid;
    const message = payload.data.message?.conversation || '';
    const instance = payload.instance;
    const apikey = payload.apikey;

    return { remoteJid, message, instance, apikey };
  }
}
