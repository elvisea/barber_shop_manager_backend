import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionTool,
} from 'openai/resources/index';

import {
  AIProvider,
  AIResponse,
  Sentiment,
} from '../interfaces/ai-provider-interface';
import { AIToolExecutorService } from '../services/ai-tool-executor.service';

/**
 * 🤖 DeepSeek Provider - Versão Simplificada
 * Baseado nas boas práticas da OpenAI para function calling
 *
 * Estrutura simplificada:
 * - Um único método generateAIResponse
 * - Suporte nativo a tools via ChatCompletionTool[]
 * - Execução automática de tool calls
 * - Contexto de mensagens com resultados das tools
 */

export class DeepseekNewProvider implements AIProvider {
  private openai: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private topP: number = 0.9;
  private frequencyPenalty: number = 0.2;
  private sentimentCache: Map<
    string,
    { sentiment: Sentiment; timestamp: number }
  >;
  private cacheTTL: number;
  private logger = new Logger(DeepseekNewProvider.name);
  private configService: ConfigService;

  constructor(
    options?: {
      verboseLogging?: boolean;
      temperature?: number;
      topP?: number;
      frequencyPenalty?: number;
      maxTokens?: number;
      cacheTTL?: number;
      configService?: ConfigService;
    },
    private readonly toolExecutor?: AIToolExecutorService,
  ) {
    this.logger.log('Iniciando DeepseekNewProvider...');
    this.configService = options?.configService || new ConfigService();
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    const baseUrl =
      this.configService.get<string>('DEEPSEEK_BASE_URL') ||
      'https://api.deepseek.com';

    this.openai = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    this.model = 'deepseek-chat';
    this.maxTokens = options?.maxTokens ?? 500;
    this.temperature = options?.temperature ?? 1.3;
    this.topP = options?.topP ?? 0.9;
    this.frequencyPenalty = options?.frequencyPenalty ?? 0.2;
    this.sentimentCache = new Map();
    this.cacheTTL = options?.cacheTTL ?? 300000;

    this.logger.log('DeepseekNewProvider inicializado.');
  }

  /**
   * 🎯 Método principal simplificado
   * Aceita tools como ChatCompletionTool[] e executa automaticamente
   */
  async generateAIResponse(
    message: string,
    prompt: string,
    contextMessages: any[] = [],
    sentiment?: Sentiment,
    tools?: ChatCompletionTool[], // ✅ Tipo correto da OpenAI
  ): Promise<AIResponse> {
    if (!prompt || prompt.length === 0) {
      this.logger.error(
        'Prompt obrigatório não fornecido para generateAIResponse.',
      );
      return {
        message: 'Desculpe, não consegui processar sua mensagem.',
        sentiment: 'neutral',
      };
    }

    this.logger.log('Gerando resposta IA...');

    let systemContent = prompt;
    if (sentiment) {
      systemContent += `\n\nO sentimento atual do usuário é: ${sentiment}.`;
    }

    const limitedContextMessages = contextMessages.slice(-3);

    // Se não há tools, usar método tradicional
    if (!tools || tools.length === 0) {
      return this.generateTraditionalResponse(
        systemContent,
        limitedContextMessages,
        message,
      );
    }

    // Usar method com tools para function calling
    return this.generateResponseWithTools(
      systemContent,
      limitedContextMessages,
      message,
      tools,
    );
  }

  /**
   * 🔄 Resposta tradicional sem function calling
   */
  private async generateTraditionalResponse(
    systemContent: string,
    contextMessages: any[],
    message: string,
  ): Promise<AIResponse> {
    const requestBody: ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages: [
        { role: 'system', content: systemContent },
        ...contextMessages,
        { role: 'user', content: message },
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
    };

    this.logger.debug(`Request tradicional: ${JSON.stringify(requestBody)}`);
    const startTime = Date.now();

    try {
      const completion = await this.openai.chat.completions.create(requestBody);
      const responseTime = Date.now() - startTime;
      const responseContent = completion.choices[0].message.content || '';

      this.logger.log(
        `Resposta recebida em ${responseTime}ms (${responseContent.length} chars)`,
      );

      return {
        message:
          responseContent || 'Desculpe, não consegui processar sua mensagem.',
        sentiment: 'neutral',
      };
    } catch (error: any) {
      this.logger.error(
        'Erro na geração de resposta:',
        error?.message || error,
      );
      return {
        message: 'Desculpe, não consegui processar sua mensagem.',
        sentiment: 'neutral',
      };
    }
  }

  /**
   * 🛠️ Resposta com function calling (apenas proxy, sem executar tools)
   */
  private async generateResponseWithTools(
    systemContent: string,
    contextMessages: any[],
    message: string,
    tools: ChatCompletionTool[],
  ): Promise<AIResponse> {
    const messages = [
      { role: 'system', content: systemContent },
      ...contextMessages,
      { role: 'user', content: message },
    ];

    const requestBody: ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
      tools: tools,
      tool_choice: 'auto',
    };

    this.logger.log(`[DEBUG] Mensagem do usuário: "${message}"`);
    this.logger.log(`[DEBUG] Número de mensagens: ${messages.length}`);
    this.logger.log(`[DEBUG] Número de tools: ${tools.length}`);
    this.logger.log(
      `[DEBUG] Tools disponíveis: ${tools.map((t) => t.function?.name).join(', ')}`,
    );
    this.logger.debug(`Request com tools: ${JSON.stringify(requestBody)}`);

    const startTime = Date.now();

    try {
      const completion = await this.openai.chat.completions.create(requestBody);
      const responseTime = Date.now() - startTime;
      const responseContent = completion.choices[0].message.content || '';
      const toolCalls = completion.choices[0].message.tool_calls;

      this.logger.log('resposta interna do completion', completion);
      this.logger.log(
        `Resposta com tools recebida em ${responseTime}ms (${responseContent.length} chars)`,
      );
      this.logger.log(`[DEBUG] Conteúdo da resposta: "${responseContent}"`);
      this.logger.log(
        `[DEBUG] Tool calls recebidos: ${JSON.stringify(toolCalls)}`,
      );

      // Retornar tool calls e mensagem para o serviço orquestrador
      let functionCalls: any[] = [];
      if (toolCalls && toolCalls.length > 0) {
        functionCalls = toolCalls.map((tc) => ({
          id: tc.id,
          name: tc.function.name,
          arguments: JSON.parse(tc.function.arguments),
        }));
      }

      return {
        message: responseContent,
        sentiment: 'neutral',
        functionCalls,
      };
    } catch (error: any) {
      this.logger.error(
        'Erro na geração de resposta com tools:',
        error?.message || error,
      );
      return {
        message: 'Desculpe, não consegui processar sua mensagem.',
        sentiment: 'neutral',
        functionCalls: [],
      };
    }
  }

  /**
   * 🎯 Gera resposta final com os resultados das tools
   */
  private async generateFinalResponse(
    systemContent: string,
    contextMessages: any[],
    originalMessage: string,
  ): Promise<string> {
    const requestBody: ChatCompletionCreateParamsNonStreaming = {
      model: this.model,
      messages: [
        { role: 'system', content: systemContent },
        ...contextMessages,
        {
          role: 'user',
          content: `Com base nos resultados das funções executadas, continue a conversa de forma natural. Mensagem original: "${originalMessage}"`,
        },
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
    };

    try {
      const completion = await this.openai.chat.completions.create(requestBody);
      return (
        completion.choices[0].message.content ||
        'Desculpe, não consegui processar sua mensagem.'
      );
    } catch (error: any) {
      this.logger.error(
        'Erro na geração da resposta final:',
        error?.message || error,
      );
      return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
    }
  }

  /**
   * 📊 Análise de sentimento (mantido para compatibilidade)
   */
  async analyzeSentiment(message: string): Promise<Sentiment> {
    this.logger.log('Analisando sentimento...');
    const cacheKey = this.generateCacheKey(message);
    const cached = this.sentimentCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      this.logger.log(`Cache hit: ${cached.sentiment}`);
      return cached.sentiment;
    }

    const systemContent = `Analise o sentimento da mensagem do usuário. Responda apenas com: 'positive', 'negative' ou 'neutral'.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: message },
        ],
        max_tokens: 5,
        temperature: 0.1,
      });

      const result =
        completion.choices[0].message.content?.toLowerCase().trim() ||
        'neutral';
      let sentiment: Sentiment = 'neutral';

      if (result.includes('positive')) sentiment = 'positive';
      else if (result.includes('negative')) sentiment = 'negative';

      this.sentimentCache.set(cacheKey, { sentiment, timestamp: Date.now() });
      this.logger.log(`Sentimento detectado: ${sentiment}`);
      return sentiment;
    } catch (error: any) {
      this.logger.error(
        'Erro na análise de sentimento:',
        error?.message || error,
      );
      return 'neutral';
    }
  }

  /**
   * 🔧 Métodos auxiliares (mantidos para compatibilidade)
   */
  private generateCacheKey(message: string): string {
    const normalizedMessage = message
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
    const key =
      normalizedMessage.length > 100
        ? `hash:${this.simpleHash(normalizedMessage)}`
        : `msg:${normalizedMessage}`;
    return key;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return hash;
  }

  clearSentimentCache(): void {
    const cacheSize = this.sentimentCache.size;
    this.sentimentCache.clear();
    this.logger.log(
      `Cache de sentimentos limpo (${cacheSize} entradas removidas)`,
    );
  }

  // Método de compatibilidade (não usado na nova estrutura)
  async executeFunctionCall(functionCall: any): Promise<any> {
    this.logger.warn('executeFunctionCall não é mais usado na nova estrutura');
    return { success: false, error: 'Método obsoleto' };
  }
}
