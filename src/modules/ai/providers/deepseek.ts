import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  AIProvider,
  AIResponse,
  Sentiment,
} from '../interfaces/ai-provider-interface';

export class DeepseekProvider implements AIProvider {
  private openai: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;
  private verboseLogging: boolean;
  private topP: number = 0.9;
  private frequencyPenalty: number = 0.2;
  private sentimentCache: Map<
    string,
    { sentiment: Sentiment; timestamp: number }
  >;
  private cacheTTL: number;
  private logger = new Logger(DeepseekProvider.name);
  private configService: ConfigService;

  constructor(options?: {
    verboseLogging?: boolean;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    maxTokens?: number;
    cacheTTL?: number;
    configService?: ConfigService;
  }) {
    this.logger.log('Iniciando DeepseekProvider...');
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
    this.verboseLogging = options?.verboseLogging ?? false;
    this.sentimentCache = new Map();
    this.cacheTTL = options?.cacheTTL ?? 300000;
    this.logger.log('DeepseekProvider inicializado.');
  }

  async generateAIResponse(
    message: string,
    prompt: string,
    contextMessages: any[] = [],
    sentiment?: Sentiment,
  ): Promise<AIResponse> {
    if (!prompt || prompt.length === 0) {
      this.logger.error(
        'Prompt obrigatório não fornecido para generateAIResponse.',
      );
      return {
        message: 'Desculpe, não consegui processar sua mensagem.',
        requestedPhoto: false,
        sentiment: 'neutral',
      };
    }
    this.logger.log('Gerando resposta IA...');
    let systemContent = prompt;
    if (sentiment) {
      systemContent += `\n\nO sentimento atual do usuário é: ${sentiment}.`;
    }
    const limitedContextMessages = contextMessages.slice(-3);
    const requestBody = {
      model: this.model,
      messages: [
        { role: 'system', content: systemContent },
        ...limitedContextMessages,
        { role: 'user', content: message },
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      top_p: this.topP,
      frequency_penalty: this.frequencyPenalty,
    };
    this.logger.debug(`Request: ${JSON.stringify(requestBody)}`);
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
        requestedPhoto: false,
        sentiment: 'neutral',
      };
    } catch (error: any) {
      this.logger.error(
        'Erro na geração de resposta:',
        error?.message || error,
      );
      return {
        message: 'Desculpe, não consegui processar sua mensagem.',
        requestedPhoto: false,
        sentiment: 'neutral',
      };
    }
  }

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
}
