import { ChatCompletionTool } from 'openai/resources/chat/completions';

import { AIFunctionCall, AIFunctionResult } from './ai-function.interface';

/**
 * 🎭 Tipos de Sentimento - Análise de sentimento da mensagem
 *
 * Usado para entender o contexto emocional da conversa
 * e ajustar a resposta da IA adequadamente
 */
export type Sentiment = 'positive' | 'negative' | 'neutral';

import { ToolExecutionResult } from '../services/ai-tool-executor.service';

/**
 * 📤 Resposta da IA - Estrutura completa da resposta
 *
 * Contém a mensagem principal, sentimento detectado,
 * function calls geradas e resultados das tools executadas
 */
export interface AIResponse {
  /** Mensagem principal da IA para o usuário */
  message: string;

  /** Sentimento detectado na mensagem do usuário */
  sentiment: Sentiment;

  /** Function calls geradas pela IA (se houver) */
  functionCalls?: AIFunctionCall[];

  /** Resultados das tools executadas (se houver) */
  toolResults?: ToolExecutionResult[];
}

/**
 * 🤖 Provider de IA - Interface principal para comunicação com IA
 *
 * Define o contrato que todos os providers de IA devem implementar.
 * Suporta function calling, análise de sentimento e execução de tools.
 *
 * RESPONSABILIDADES:
 * - Gerar respostas da IA com function calling
 * - Analisar sentimento das mensagens
 * - Executar function calls quando solicitado
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
   * Gera uma resposta da IA baseada na mensagem do usuário,
   * podendo incluir function calls se necessário.
   *
   * FLUXO:
   * 1. Analisa a mensagem do usuário
   * 2. Gera resposta com ou sem function calls
   * 3. Retorna estrutura completa da resposta
   *
   * @param message Mensagem do usuário
   * @param prompt Prompt do sistema para a IA
   * @param contextMessages Mensagens de contexto da conversa
   * @param sentiment Sentimento pré-detectado (opcional)
   * @param tools Tools disponíveis para function calling
   * @returns Resposta completa da IA
   *
   * @example
   * ```typescript
   * const provider = new DeepseekProvider();
   * const tools = toolRegistry.getChatCompletionTools();
   *
   * const response = await provider.generateAIResponse(
   *   'Crie um plano chamado Premium',
   *   'Você é um assistente de barbearia.',
   *   [], // contexto
   *   'neutral', // sentimento
   *   tools, // tools disponíveis
   * );
   *
   * console.log(response.message); // Resposta da IA
   * console.log(response.functionCalls); // Function calls geradas
   * ```
   */
  generateAIResponse(
    message: string,
    prompt: string,
    contextMessages?: any[],
    sentiment?: Sentiment,
    tools?: ChatCompletionTool[], // ✅ Tipo correto da OpenAI
  ): Promise<AIResponse>;

  /**
   * 🎭 ANALISAR SENTIMENTO - Detecta sentimento da mensagem
   *
   * Analisa o sentimento emocional da mensagem do usuário
   * para ajustar o tom da resposta da IA.
   *
   * @param message Mensagem a ser analisada
   * @returns Sentimento detectado (positive, negative, neutral)
   *
   * @example
   * ```typescript
   * const sentiment = await provider.analyzeSentiment('Estou muito feliz!');
   * console.log(sentiment); // 'positive'
   * ```
   */
  analyzeSentiment(message: string): Promise<Sentiment>;

  /**
   * 🛠️ EXECUTAR FUNCTION CALL - Executa uma função específica
   *
   * Executa uma function call gerada pela IA,
   * retornando o resultado da execução.
   *
   * @param functionCall Function call a ser executada
   * @returns Resultado da execução da função
   *
   * @example
   * ```typescript
   * const functionCall: AIFunctionCall = {
   *   name: 'create_plan',
   *   arguments: { name: 'Premium', price: 99.99 }
   * };
   *
   * const result = await provider.executeFunctionCall(functionCall);
   * console.log(result.success); // true/false
   * console.log(result.data); // dados retornados
   * ```
   */
  executeFunctionCall(functionCall: AIFunctionCall): Promise<AIFunctionResult>;
}

/**
 * 📚 Exemplo de Implementação Completa
 *
 * ```typescript
 * @Injectable()
 * export class DeepseekProvider implements AIProvider {
 *   async generateAIResponse(
 *     message: string,
 *     prompt: string,
 *     contextMessages: any[] = [],
 *     sentiment?: Sentiment,
 *     tools?: ChatCompletionTool[],
 *   ): Promise<AIResponse> {
 *     // 1. Preparar mensagens para a IA
 *     const messages = [
 *       { role: 'system', content: prompt },
 *       ...contextMessages,
 *       { role: 'user', content: message },
 *     ];
 *
 *     // 2. Chamar API da DeepSeek
 *     const completion = await this.client.chat.completions.create({
 *       model: 'deepseek-chat',
 *       messages,
 *       tools,
 *       tool_choice: 'auto',
 *     });
 *
 *     // 3. Processar resposta
 *     const response = completion.choices[0].message;
 *
 *     return {
 *       message: response.content || '',
 *       sentiment: sentiment || 'neutral',
 *       functionCalls: response.tool_calls?.map(tc => ({
 *         name: tc.function.name,
 *         arguments: JSON.parse(tc.function.arguments),
 *       })),
 *     };
 *   }
 *
 *   async analyzeSentiment(message: string): Promise<Sentiment> {
 *     // Implementação da análise de sentimento
 *     return 'neutral';
 *   }
 *
 *   async executeFunctionCall(functionCall: AIFunctionCall): Promise<AIFunctionResult> {
 *     // Implementação da execução de function call
 *     return { success: true, data: {} };
 *   }
 * }
 * ```
 */
