import {
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from 'openai/resources/chat/completions';

/**
 * 🤖 Provider de IA - Interface simplificada para comunicação com IA
 *
 * Define o contrato que todos os providers de IA devem implementar.
 * Foco em function calling e geração de respostas.
 *
 * RESPONSABILIDADES:
 * - Gerar respostas da IA com function calling
 * - Comunicar com APIs de IA (DeepSeek, OpenAI, etc.)
 *
 * IMPLEMENTAÇÕES:
 * - DeepseekProvider: Provider para DeepSeek API
 * - OpenAIProvider: Provider para OpenAI API (futuro)
 * - MockProvider: Provider para testes
 */
export interface AIProvider {
  /**
   * 🎯 GERAR RESPOSTA DA IA - Método principal
   *
   * Gera uma resposta da IA baseada nas mensagens fornecidas,
   * podendo incluir function calling se tools forem fornecidas.
   *
   * FLUXO:
   * 1. Recebe mensagens e tools opcionais
   * 2. Envia para API da IA
   * 3. Retorna resposta da IA
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
   * const response = await provider.generateResponse(messages, tools);
   *
   * console.log(response.content); // Resposta da IA
   * console.log(response.tool_calls); // Function calls geradas
   * ```
   */
  generateResponse(
    messages: ChatCompletionMessageParam[],
    tools?: ChatCompletionTool[],
  ): Promise<ChatCompletionMessage>;
}

/**
 * 📚 Exemplo de Implementação Completa
 *
 * ```typescript
 * @Injectable()
 * export class DeepseekProvider implements AIProvider {
 *   constructor(private readonly configService: ConfigService) {
 *     this.client = new OpenAI({
 *       apiKey: this.configService.get<string>('DEEPSEEK_API_KEY'),
 *       baseURL: 'https://api.deepseek.com',
 *     });
 *   }
 *
 *   async generateResponse(
 *     messages: ChatCompletionMessageParam[],
 *     tools?: ChatCompletionTool[],
 *   ): Promise<ChatCompletionMessage> {
 *     const completion = await this.client.chat.completions.create({
 *       model: 'deepseek-chat',
 *       messages,
 *       tools,
 *       tool_choice: tools && tools.length > 0 ? 'auto' : undefined,
 *     });
 *
 *     return completion.choices[0].message;
 *   }
 * }
 * ```
 */
