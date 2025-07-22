import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

import { AIProvider } from '../interfaces/ai-provider-interface';

/**
 * 🤖 DeepSeek Provider - Versão Simplificada e Consolidada
 *
 * RESPONSABILIDADES:
 * 1. Comunicar com a API DeepSeek
 * 2. Gerar respostas com function calling
 * 3. Gerenciar configurações da API
 *
 * FLUXO:
 * 1. Recebe mensagens e tools
 * 2. Envia para DeepSeek API
 * 3. Retorna resposta da IA
 */
export class DeepseekProvider implements AIProvider {
  private readonly logger = new Logger(DeepseekProvider.name);
  private readonly client: OpenAI;
  private readonly model: string = 'deepseek-chat';

  constructor(private readonly configService: ConfigService) {
    this.logger.log('🔧 [DEEPSEEK] Inicializando DeepSeek Provider...');

    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    const baseURL =
      this.configService.get<string>('DEEPSEEK_BASE_URL') ||
      'https://api.deepseek.com';

    if (!apiKey) {
      this.logger.error('❌ [DEEPSEEK] DEEPSEEK_API_KEY não configurada');
      throw new Error('DEEPSEEK_API_KEY é obrigatória');
    }

    this.client = new OpenAI({
      apiKey,
      baseURL,
    });

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
        tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
      });

      const response = completion.choices[0].message;

      this.logger.log(
        '🤖 [DEEPSEEK] Resposta completa da API:',
        JSON.stringify(completion, null, 2),
      );
      this.logger.log('✅ [DEEPSEEK] Resposta gerada com sucesso');

      return response;
    } catch (error: any) {
      this.logger.error('❌ [DEEPSEEK] Erro ao gerar resposta:', error);
      this.logger.error(
        '❌ [DEEPSEEK] Detalhes do erro:',
        error?.message || error,
      );

      // Retornar mensagem de erro padrão
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
    const baseURL =
      this.configService.get<string>('DEEPSEEK_BASE_URL') ||
      'https://api.deepseek.com';
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');

    return {
      model: this.model,
      baseURL,
      isConfigured: !!apiKey,
    };
  }
}
