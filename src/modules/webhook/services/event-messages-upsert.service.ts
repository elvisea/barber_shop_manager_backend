import { readFileSync } from 'fs';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Tipagem para resposta da busca de mensagens
export interface FindMessagesResponse {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: MessageRecord[];
  };
}

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

import { MessagesUpsertLog } from '../interfaces';

import { HttpClientService } from '@/http-client/http-client.service';
import { AIProviderFactoryService } from '@/modules/ai/services/ai-provider-factory.service';

/**
 * Estrutura para controlar o buffer de mensagens por usuário (remoteJid)
 */
interface MessageBuffer {
  messages: string[];
  timer: NodeJS.Timeout | null;
  lastMessageTime: number;
}

/**
 * Service responsável por processar eventos de mensagens recebidas (messages.upsert)
 * Agora implementa buffer/debounce para evitar respostas fragmentadas.
 */
@Injectable()
export class EventMessagesUpsertService {
  private readonly logger = new Logger(EventMessagesUpsertService.name);
  private readonly prompt: string;

  // Buffer de mensagens por usuário (remoteJid)
  private readonly messageBuffers: Record<string, MessageBuffer> = {};
  // Tempo de inatividade (ms) para considerar que o usuário terminou de digitar
  private readonly USER_INACTIVITY_TIMEOUT_MS = 7500;

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly configService: ConfigService,
    private readonly aiProviderFactory: AIProviderFactoryService,
  ) {
    // Carrega o prompt do arquivo na inicialização do service
    try {
      this.prompt = readFileSync('src/modules/ai/prompts/luna.json', 'utf-8');
      this.logger.log(
        `[Prompt] Carregado para IA (${this.prompt.length} caracteres)`,
      );
    } catch (error) {
      this.logger.error('[Prompt] Erro ao carregar o prompt para IA:', error);
      this.prompt =
        'Você é um assistente de atendimento amigável e objetivo, fornecendo respostas claras e concisas em português.';
    }
  }

  /**
   * Ponto de entrada para cada mensagem recebida do Evolution API (messages.upsert)
   * Implementa buffer/debounce para evitar respostas fragmentadas.
   * @param payload Mensagem recebida do webhook
   */
  async handle(payload: MessagesUpsertLog): Promise<void> {
    const remoteJid = payload.data.key.remoteJid;
    const userMessage = payload.data.message.conversation || '';
    this.logger.log(
      `[Buffer] Mensagem recebida de ${remoteJid}: "${userMessage}"`,
    );

    // Inicializa buffer para o usuário se não existir
    if (!this.messageBuffers[remoteJid]) {
      this.messageBuffers[remoteJid] = {
        messages: [],
        timer: null,
        lastMessageTime: Date.now(),
      };
      this.logger.log(`[Buffer] Criado novo buffer para usuário: ${remoteJid}`);
    }

    // Adiciona mensagem ao buffer
    const buffer = this.messageBuffers[remoteJid];
    buffer.messages.push(userMessage);
    buffer.lastMessageTime = Date.now();
    this.logger.log(
      `[Buffer] Mensagem adicionada ao buffer de ${remoteJid}: "${userMessage}"`,
    );

    // Limpa timer anterior, se existir
    if (buffer.timer) {
      clearTimeout(buffer.timer);
    }

    // Configura novo timer para processar o buffer após inatividade
    buffer.timer = setTimeout(async () => {
      await this.processBuffer(remoteJid, payload);
    }, this.USER_INACTIVITY_TIMEOUT_MS);
  }

  /**
   * Processa o buffer de mensagens de um usuário após o tempo de inatividade
   * Concatena as mensagens, busca contexto, gera resposta IA e envia ao cliente
   * @param remoteJid Identificador do usuário (WhatsApp JID)
   * @param lastPayload Último payload recebido (usado para dados auxiliares)
   */
  private async processBuffer(
    remoteJid: string,
    lastPayload: MessagesUpsertLog,
  ): Promise<void> {
    const buffer = this.messageBuffers[remoteJid];
    if (!buffer) return;
    const fullText = buffer.messages.join(' ').trim();
    buffer.messages = [];
    buffer.timer = null;
    this.logger.log(
      `[Buffer] Processando mensagens de ${remoteJid}: "${fullText}"`,
    );

    // --- A partir daqui, segue o fluxo normal de processamento (busca contexto, IA, envio) ---
    const { instance, apikey } = lastPayload;
    // Buscar histórico de mensagens para contexto
    const apiUrl =
      this.configService.get<string>('EVOLUTION_API_URL') || 'http://api:8080';
    const findMessagesUrl = `${apiUrl}/chat/findMessages/${instance}`;
    this.logger.log(`Buscando contexto em: ${findMessagesUrl}`);
    const findMessagesBody = {
      where: {
        key: {
          remoteJid,
        },
      },
      page: 1,
      offset: 10,
    };
    let contextMessages: any[] = [];
    try {
      const contextResponse =
        await this.httpClient.request<FindMessagesResponse>(findMessagesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey,
          },
          data: findMessagesBody,
        });
      const responseData = (contextResponse as any)?.data;
      this.logger.log(
        'Mensagens de contexto recebidas:',
        JSON.stringify(responseData, null, 2),
      );
      if (
        responseData?.messages?.records &&
        Array.isArray(responseData.messages.records)
      ) {
        contextMessages = responseData.messages.records
          .map((msg: MessageRecord) => {
            if (msg.key.fromMe) {
              return {
                role: 'assistant',
                content: msg.message?.conversation || '',
              };
            } else {
              return { role: 'user', content: msg.message?.conversation || '' };
            }
          })
          .filter((m: any) => m.content && m.content.length > 0);
      }
    } catch (err) {
      this.logger.error('Erro ao buscar contexto:', err);
      contextMessages = [];
    }

    // Gera resposta com IA usando o novo padrão de factory
    const aiProvider = this.aiProviderFactory.getProvider();
    this.logger.log(`Texto recebido do usuário (bufferizado): ${fullText}`);
    const aiResponse = await aiProvider.generateAIResponse(
      fullText,
      this.prompt,
      contextMessages,
    );
    const text = aiResponse.message;
    this.logger.log(`Texto de resposta gerado pela IA: ${text}`);

    const url = `${apiUrl}/message/sendText/${instance}`;
    this.logger.log(`URL de envio: ${url}`);
    this.logger.log(`API Key utilizada: ${apikey}`);

    const number = remoteJid.replace(/[^0-9]/g, '');
    const response = await this.httpClient.request(url, {
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
      `Resposta recebida da API: ${JSON.stringify(response, null, 2)}`,
    );
    this.logger.log(`Mensagem de resposta enviada para ${number}`);
    this.logger.log('--- FIM DO PROCESSAMENTO ---');
  }
}
