import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

import { AIProvider } from '../interfaces/ai-provider-interface';

import { getErrorMessage } from '@/common/utils';

/**
 * DeepseekProvider - Provider para integração com a API DeepSeek (compatível OpenAI)
 *
 * RESPONSABILIDADES:
 * - Comunicar com a API DeepSeek usando o padrão OpenAI
 * - Suportar function calling (tools)
 * - Gerenciar configuração via DI (ConfigService)
 * - Gerar logs detalhados para debugging
 *
 * FLUXO DE USO:
 * 1. Recebe mensagens e tools
 * 2. Envia para a API DeepSeek
 * 3. Retorna a resposta da IA (incluindo tool calls se houver)
 *
 * INJEÇÃO DE DEPENDÊNCIAS:
 * - Usa ConfigService para obter API key e baseURL
 * - Usa Logger do NestJS para logs
 *
 * EXEMPLO DE USO:
 * ```typescript
 * const response = await deepseekProvider.generateResponse(messages, tools);
 * ```
 *
 * @see https://api.deepseek.com/ (documentação oficial)
 */
@Injectable()
export class DeepseekProvider implements AIProvider {
  private readonly logger = new Logger(DeepseekProvider.name);
  private readonly model: string = 'deepseek-chat';
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('🔧 [DEEPSEEK] Inicializando DeepSeek Provider...');
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    const baseURL = this.configService.get<string>(
      'DEEPSEEK_BASE_URL',
      'https://api.deepseek.com',
    );
    if (!apiKey) {
      this.logger.error('❌ [DEEPSEEK] DEEPSEEK_API_KEY não configurada');
      throw new Error('DEEPSEEK_API_KEY é obrigatória');
    }
    this.client = new OpenAI({ apiKey, baseURL });
    this.logger.log(
      `✅ [DEEPSEEK] Provider inicializado com baseURL: ${baseURL}`,
    );
  }

  /**
   * 🎯 MÉTODO PRINCIPAL - Gera resposta da IA
   *
   * @param messages Array de mensagens para enviar
   * @param tools Tools disponíveis para function calling (opcional)
   * @returns Promise<OpenAI.Chat.Completions.ChatCompletionMessage>
   *
   * @example
   * ```typescript
   * const messages = [
   *   { role: 'system', content: 'Você é um assistente útil.' },
   *   { role: 'user', content: 'Quero ver os planos' }
   * ];
   *
   * const tools = toolRegistry.getChatCompletionTools();
   * const response = await deepseekProvider.generateResponse(messages, tools);
   * ```
   */
  async generateResponse(
    messages: ChatCompletionMessageParam[],
    tools?: ChatCompletionTool[],
  ): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
    this.logger.log('🤖 [DEEPSEEK] Iniciando geração de resposta...');
    this.logger.log(`🤖 [DEEPSEEK] Mensagens: ${messages.length}`);
    this.logger.log(`🤖 [DEEPSEEK] Tools: ${tools?.length || 0}`);
    if (tools && tools.length > 0) {
      this.logger.log(
        `🤖 [DEEPSEEK] Tools disponíveis: ${tools.map((t) => t.function.name).join(', ')}`,
      );
    }
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages,
        tools,
        max_tokens: 1000,
        temperature: 0.7,
        tool_choice: 'auto',
      });

      const response = completion.choices[0].message;
      this.logger.log(
        '🤖 [DEEPSEEK] Resposta completa da API:',
        JSON.stringify(completion, null, 2),
      );
      this.logger.log('✅ [DEEPSEEK] Resposta gerada com sucesso');
      return response;
    } catch (error: unknown) {
      this.logger.error('❌ [DEEPSEEK] Erro ao gerar resposta:', error);
      const errorMessage = getErrorMessage(error);
      this.logger.error('❌ [DEEPSEEK] Detalhes do erro:', errorMessage);
      return {
        role: 'assistant',
        content:
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        refusal: null,
      };
    }
  }

  /**
   * 📊 ESTATÍSTICAS - Informações sobre o provider
   *
   * @returns Informações de configuração
   */
  getStats(): { model: string; baseURL: string; isConfigured: boolean } {
    const baseURL = this.configService.get<string>(
      'DEEPSEEK_BASE_URL',
      'https://api.deepseek.com',
    );
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    return {
      model: this.model,
      baseURL,
      isConfigured: !!apiKey,
    };
  }
}
