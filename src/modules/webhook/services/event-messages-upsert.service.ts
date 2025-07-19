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

  // Prompt estático para IA - Luna, assistente virtual da barbearia
  private readonly prompt = JSON.stringify({
    prompt:
      'You are Luna, a virtual assistant and secretary for a beauty/barber shop. Your main tasks are to greet and assist clients, check if they are registered in the database, ask which service(s) they want to book, find out which professional (barber, manicurist, hairdresser, etc.) they prefer, and confirm the desired date and time for the appointment. Always be polite, professional, and concise. Never provide personal opinions or information. If the client is not registered, collect their name and phone number. If the client is already registered, confirm their details. Guide the conversation step by step to gather all necessary information for scheduling. If the client asks about available services or professionals, provide a clear and friendly list. If you do not know the answer, say you will check and return soon. Never discuss topics unrelated to the establishment or services. Always keep the conversation focused on customer service and scheduling.',
    directives: [
      'Greet the client by name if possible, or use a polite greeting if not.',
      'If the client is not registered, ask for their full name and phone number to register them.',
      'Ask which service(s) the client wants to book (e.g., haircut, manicure, etc.).',
      'Ask if the client has a preferred professional. If not, offer to suggest available staff.',
      'Ask for the preferred date and time for the appointment. If unavailable, suggest alternatives.',
      'Confirm all details before finalizing the booking: client name, phone, service(s), professional, date and time.',
      'If the client asks about prices, provide the information clearly and objectively.',
      'If the client asks about available services or professionals, provide a clear and friendly list.',
      'Always be cordial, objective, and avoid informal or personal language.',
      "Never discuss personal topics, jokes, or anything unrelated to the establishment's services.",
      'If the client requests something not offered, politely inform them and suggest alternatives if possible.',
      'If you need to check information, say you will check and return soon.',
      'Never confirm an appointment without all required information.',
      'Keep responses short, clear, and focused on the next step in the scheduling process.',
    ],
  });

  // Buffer de mensagens por usuário (remoteJid)
  private readonly messageBuffers: Record<string, MessageBuffer> = {};
  // Tempo de inatividade (ms) para considerar que o usuário terminou de digitar
  private readonly USER_INACTIVITY_TIMEOUT_MS = 7500;

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly configService: ConfigService,
    private readonly aiProviderFactory: AIProviderFactoryService,
  ) {
    this.logger.log(
      `[Prompt] Loaded for IA (${this.prompt.length} characters)`,
    );
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
      `[Buffer] Message received from ${remoteJid}: "${userMessage}"`,
    );

    // Inicializa buffer para o usuário se não existir
    if (!this.messageBuffers[remoteJid]) {
      this.messageBuffers[remoteJid] = {
        messages: [],
        timer: null,
        lastMessageTime: Date.now(),
      };
      this.logger.log(`[Buffer] Created new buffer for user: ${remoteJid}`);
    }

    // Adiciona mensagem ao buffer
    const buffer = this.messageBuffers[remoteJid];
    buffer.messages.push(userMessage);
    buffer.lastMessageTime = Date.now();
    this.logger.log(
      `[Buffer] Message added to buffer for ${remoteJid}: "${userMessage}"`,
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
      `[Buffer] Processing messages for ${remoteJid}: "${fullText}"`,
    );

    // --- A partir daqui, segue o fluxo normal de processamento (busca contexto, IA, envio) ---
    const { instance, apikey } = lastPayload;
    // Buscar histórico de mensagens para contexto
    const apiUrl =
      this.configService.get<string>('EVOLUTION_API_URL') || 'http://api:8080';
    const findMessagesUrl = `${apiUrl}/chat/findMessages/${instance}`;
    this.logger.log(`Fetching context from: ${findMessagesUrl}`);
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
        'Context messages received:',
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
      this.logger.error('Error fetching context:', err);
      contextMessages = [];
    }

    // Gera resposta com IA usando o novo padrão de factory
    const aiProvider = this.aiProviderFactory.getProvider();
    this.logger.log(`Text received from user (buffered): ${fullText}`);
    const aiResponse = await aiProvider.generateAIResponse(
      fullText,
      this.prompt,
      contextMessages,
    );
    const text = aiResponse.message;
    this.logger.log(`AI response text generated: ${text}`);

    const url = `${apiUrl}/message/sendText/${instance}`;
    this.logger.log(`Send URL: ${url}`);
    this.logger.log(`API Key used: ${apikey}`);

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

    this.logger.log(`API response: ${JSON.stringify(response, null, 2)}`);
    this.logger.log(`Reply message sent to ${number}`);
    this.logger.log('--- END OF PROCESSING ---');
  }
}
