import { Injectable, Logger } from '@nestjs/common';

import { ToolRegistryService } from '../tools/registry/tool-registry';
import { ToolContext, ToolResult } from '../tools/types/tool-definition.types';

import { getErrorMessage } from '@/common/utils';

/**
 * ⚙️ AIToolExecutorService - Executor Centralizado de Tools da IA
 *
 * RESPONSABILIDADES:
 * 1. Executar function calls retornadas pela IA
 * 2. Gerenciar múltiplas execuções de tools
 * 3. Gerar contexto com resultados para a IA
 * 4. Validar tool calls antes da execução
 * 5. Fornecer informações sobre tools disponíveis
 *
 * FLUXO DE FUNCIONAMENTO:
 * 1. Recebe tool calls da IA
 * 2. Valida cada tool call
 * 3. Executa tools através do ToolRegistry
 * 4. Coleta resultados e erros
 * 5. Gera contexto para próxima chamada da IA
 *
 * ARQUITETURA:
 * - ToolCall: Representa uma chamada de função
 * - ToolExecutionResult: Resultado da execução
 * - ToolRegistryService: Acesso às tools registradas
 *
 * USO NO SISTEMA:
 * - Chamado pelo EventMessagesUpsertService
 * - Executa tools quando IA gera function calls
 * - Fornece resultados para continuar conversa
 */

/**
 * 📞 ToolCall - Representa uma chamada de função da IA
 *
 * Contém o nome da função e os argumentos fornecidos
 * pela IA para execução
 */
export interface ToolCall {
  /** Nome da função a ser executada */
  name: string;

  /** Argumentos fornecidos pela IA */
  arguments: Record<string, any>;
}

/**
 * 📤 ToolExecutionResult - Resultado da execução de uma tool
 *
 * Contém informações sobre o sucesso/falha da execução
 * e os dados retornados ou erro ocorrido
 */
export interface ToolExecutionResult {
  /** Tool call original que foi executada */
  toolCall: ToolCall;

  /** Resultado da execução (dados ou null se erro) */
  result: any;

  /** Se a execução foi bem-sucedida */
  success: boolean;

  /** Mensagem de erro (se houver) */
  error?: string;
}

/**
 * ⚙️ AIToolExecutorService - Executor Centralizado de Tools
 *
 * Serviço responsável por executar as function calls retornadas pela IA,
 * seguindo as boas práticas da OpenAI para function calling.
 *
 * CARACTERÍSTICAS:
 * - Execução individual e em lote de tools
 * - Validação de tool calls antes da execução
 * - Geração de contexto com resultados
 * - Logs detalhados de todas as operações
 * - Tratamento robusto de erros
 */
@Injectable()
export class AIToolExecutorService {
  private readonly logger = new Logger(AIToolExecutorService.name);

  constructor(private readonly toolRegistry: ToolRegistryService) {
    this.logger.log('⚙️ [EXECUTOR] AIToolExecutorService inicializado');
    this.logger.log(
      `⚙️ [EXECUTOR] Tools disponíveis: ${this.toolRegistry.listAvailableTools().join(', ')}`,
    );
  }

  /**
   * 🛠️ EXECUTAR TOOL INDIVIDUAL - Executa uma única tool call
   *
   * FLUXO:
   * 1. Valida a tool call
   * 2. Executa através do ToolRegistry
   * 3. Captura resultado ou erro
   * 4. Retorna estrutura padronizada
   *
   * @param toolCall Tool call a ser executada
   * @param context Contexto adicional (opcional)
   * @returns Resultado da execução da tool
   *
   * @example
   * ```typescript
   * const toolCall: ToolCall = {
   *   name: 'get_plans',
   *   arguments: { page: 1, limit: 10 }
   * };
   *
   * const result = await executor.executeToolCall(toolCall);
   * console.log(result.success); // true/false
   * console.log(result.result); // dados ou null
   * ```
   */
  async executeToolCall(
    toolCall: ToolCall,
    context?: ToolContext,
  ): Promise<ToolExecutionResult> {
    this.logger.log(
      `🛠️ [EXECUTOR] Iniciando execução da tool: "${toolCall.name}"`,
    );
    this.logger.log(
      `🛠️ [EXECUTOR] Argumentos recebidos:`,
      JSON.stringify(toolCall.arguments, null, 2),
    );

    try {
      // Validar tool call antes da execução
      if (!this.validateToolCall(toolCall)) {
        const errorMsg = `Tool call inválida: ${toolCall.name}`;
        this.logger.error(`❌ [EXECUTOR] ${errorMsg}`);

        return {
          toolCall,
          result: null,
          success: false,
          error: errorMsg,
        };
      }

      this.logger.log(`✅ [EXECUTOR] Tool call validada, executando...`);

      // Executar a tool através do registry
      const result = (await this.toolRegistry.executeTool(
        toolCall.name,
        toolCall.arguments,
        context,
      )) as ToolResult<any>;

      this.logger.log(
        `✅ [EXECUTOR] Tool "${toolCall.name}" executada com sucesso`,
      );
      this.logger.log(
        `✅ [EXECUTOR] Resultado:`,
        JSON.stringify(result, null, 2),
      );

      // Retornar apenas o resultado bruto para ser usado em mensagem 'tool'
      return {
        toolCall,
        result: (result.data ?? result) as unknown,
        success: true,
      };
    } catch (error: unknown) {
      this.logger.error(
        `❌ [EXECUTOR] Erro ao executar tool "${toolCall.name}":`,
        error,
      );
      const errorMessage = getErrorMessage(error);
      this.logger.error(`❌ [EXECUTOR] Mensagem de erro: ${errorMessage}`);

      return {
        toolCall,
        result: null,
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * 🔄 EXECUTAR MÚLTIPLAS TOOLS - Executa várias tool calls em sequência
   *
   * FLUXO:
   * 1. Itera sobre todas as tool calls
   * 2. Executa cada uma individualmente
   * 3. Coleta todos os resultados
   * 4. Retorna array com resultados
   *
   * @param toolCalls Array de tool calls a serem executadas
   * @param context Contexto adicional (opcional)
   * @returns Array com resultados de todas as execuções
   *
   * @example
   * ```typescript
   * const toolCalls: ToolCall[] = [
   *   { name: 'get_plans', arguments: { page: 1 } },
   *   { name: 'create_plan', arguments: { name: 'Premium', price: 99.99 } }
   * ];
   *
   * const results = await executor.executeToolCalls(toolCalls);
   * console.log(`Executadas ${results.length} tools`);
   * ```
   */
  async executeToolCalls(
    toolCalls: ToolCall[],
    context?: ToolContext,
  ): Promise<ToolExecutionResult[]> {
    this.logger.log(
      `🔄 [EXECUTOR] Iniciando execução de ${toolCalls.length} tool calls`,
    );
    this.logger.log(
      `🔄 [EXECUTOR] Tools a executar: ${toolCalls.map((tc) => tc.name).join(', ')}`,
    );

    const results: ToolExecutionResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (const toolCall of toolCalls) {
      this.logger.log(
        `🔄 [EXECUTOR] Executando tool ${results.length + 1}/${toolCalls.length}: "${toolCall.name}"`,
      );

      const result = await this.executeToolCall(toolCall, context);
      results.push(result);

      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }

    this.logger.log(
      `📊 [EXECUTOR] Execução concluída: ${successCount} sucessos, ${errorCount} erros`,
    );
    this.logger.log(
      `📊 [EXECUTOR] Resultados finais:`,
      JSON.stringify(results, null, 2),
    );

    return results;
  }

  /**
   * 📊 GERAR CONTEXTO COM RESULTADOS - Cria mensagens para a IA com resultados
   *
   * FLUXO:
   * 1. Itera sobre todos os resultados
   * 2. Cria mensagem para cada resultado
   * 3. Formata sucessos e erros adequadamente
   * 4. Retorna array de mensagens para a IA
   *
   * @param toolResults Resultados das execuções de tools
   * @returns Array de mensagens para enviar à IA
   *
   * @example
   * ```typescript
   * const toolResults = await executor.executeToolCalls(toolCalls);
   * const contextMessages = executor.generateToolResultsContext(toolResults);
   *
   * // Adicionar ao histórico da IA
   * messages.push(...contextMessages);
   * ```
   */
  generateToolResultsContext(toolResults: ToolExecutionResult[]): any[] {
    this.logger.log(
      `📊 [CONTEXTO] Gerando contexto para ${toolResults.length} resultados de tools`,
    );

    const contextMessages: any[] = [];

    for (const result of toolResults) {
      if (result.success) {
        this.logger.log(
          `✅ [CONTEXTO] Tool "${result.toolCall.name}" executada com sucesso`,
        );

        contextMessages.push({
          role: 'assistant',
          content: `Resultado da função ${result.toolCall.name}: ${JSON.stringify(result.result)}`,
        });
      } else {
        this.logger.error(
          `❌ [CONTEXTO] Tool "${result.toolCall.name}" falhou: ${result.error}`,
        );

        contextMessages.push({
          role: 'assistant',
          content: `Erro na função ${result.toolCall.name}: ${result.error}`,
        });
      }
    }

    this.logger.log(
      `📊 [CONTEXTO] Contexto gerado com ${contextMessages.length} mensagens`,
    );
    this.logger.log(
      `📊 [CONTEXTO] Mensagens:`,
      JSON.stringify(contextMessages, null, 2),
    );

    return contextMessages;
  }

  /**
   * 🔍 VALIDAR TOOL CALL - Verifica se uma tool call é válida
   *
   * VALIDAÇÕES:
   * 1. Tool call tem nome e argumentos
   * 2. Tool existe no registry
   *
   * @param toolCall Tool call a ser validada
   * @returns true se válida, false caso contrário
   *
   * @example
   * ```typescript
   * const isValid = executor.validateToolCall(toolCall);
   * if (!isValid) {
   *   console.log('Tool call inválida');
   * }
   * ```
   */
  validateToolCall(toolCall: ToolCall): boolean {
    this.logger.log(`🔍 [VALIDAÇÃO] Validando tool call: "${toolCall.name}"`);

    // Verificar se tool call tem estrutura básica
    if (!toolCall.name || !toolCall.arguments) {
      this.logger.warn(
        `⚠️ [VALIDAÇÃO] Tool call inválida: nome ou argumentos ausentes`,
      );
      return false;
    }

    // Verificar se tool existe no registry
    const toolExists = this.toolRegistry.hasTool(toolCall.name);

    if (toolExists) {
      this.logger.log(
        `✅ [VALIDAÇÃO] Tool "${toolCall.name}" validada com sucesso`,
      );
    } else {
      this.logger.warn(
        `⚠️ [VALIDAÇÃO] Tool "${toolCall.name}" não encontrada no registry`,
      );
    }

    return toolExists;
  }

  /**
   * 📋 LISTAR TOOLS DISPONÍVEIS - Retorna lista de todas as tools
   *
   * @returns Array com nomes de todas as tools registradas
   *
   * @example
   * ```typescript
   * const availableTools = executor.getAvailableTools();
   * console.log('Tools disponíveis:', availableTools);
   * ```
   */
  getAvailableTools(): string[] {
    const tools = this.toolRegistry.listAvailableTools();
    this.logger.log(`📋 [LISTA] Tools disponíveis: ${tools.length} tools`);
    this.logger.log(`📋 [LISTA] Nomes: ${tools.join(', ')}`);
    return tools;
  }

  /**
   * 📈 ESTATÍSTICAS - Obtém informações sobre o executor
   *
   * @returns Estatísticas do executor
   *
   * @example
   * ```typescript
   * const stats = executor.getStats();
   * console.log(`Total de tools: ${stats.totalTools}`);
   * ```
   */
  getStats(): { totalTools: number; toolNames: string[] } {
    const tools = this.getAvailableTools();
    const stats = {
      totalTools: tools.length,
      toolNames: tools,
    };

    this.logger.log(
      `📈 [STATS] Estatísticas do executor:`,
      JSON.stringify(stats, null, 2),
    );

    return stats;
  }
}

/**
 * 📚 Exemplos de Uso Completo
 *
 * ```typescript
 * @Injectable()
 * export class EventMessagesUpsertService {
 *   constructor(
 *     private readonly toolExecutor: AIToolExecutorService,
 *   ) {}
 *
 *   async processToolCalls(toolCalls: ToolCall[]) {
 *     // 1. Executar todas as tools
 *     const results = await this.toolExecutor.executeToolCalls(toolCalls);
 *
 *     // 2. Gerar contexto com resultados
 *     const contextMessages = this.toolExecutor.generateToolResultsContext(results);
 *
 *     // 3. Adicionar ao histórico da IA
 *     messages.push(...contextMessages);
 *
 *     // 4. Chamar IA novamente com resultados
 *     const finalResponse = await this.sendToAI(messages, tools);
 *
 *     return finalResponse;
 *   }
 * }
 * ```
 */
