import { Injectable, Logger } from '@nestjs/common';
import { ChatCompletionTool } from 'openai/resources/chat/completions';

import { PlanToolHandlers } from '../handlers/plan-handlers';
import {
  ToolHandler,
  ToolRegistry,
  ToolContext,
  toChatCompletionTool,
} from '../types/tool-definition.types';

/**
 * 🔧 ToolRegistryService - Registro Centralizado de Tools para IA
 *
 * RESPONSABILIDADES:
 * 1. Registrar todas as tools disponíveis no sistema
 * 2. Converter tools para formato ChatCompletionTool da OpenAI
 * 3. Executar tools quando solicitadas pela IA
 * 4. Gerenciar o ciclo de vida das tools
 *
 * FLUXO DE FUNCIONAMENTO:
 * 1. Inicialização: Registra todas as tools disponíveis
 * 2. Conversão: Transforma tools para formato OpenAI
 * 3. Execução: Executa tools quando chamadas pela IA
 * 4. Monitoramento: Logs detalhados de todo o processo
 *
 * ARQUITETURA:
 * - ToolRegistry: Mapa de tools por nome
 * - ToolHandler: Interface para execução de tools
 * - ChatCompletionTool: Formato OpenAI para function calling
 *
 * TOOLS DISPONÍVEIS:
 * - create_plan: Cria novos planos
 * - get_plans: Lista planos existentes
 */
@Injectable()
export class ToolRegistryService {
  private readonly logger = new Logger(ToolRegistryService.name);

  /**
   * 📚 Registro principal de tools
   * Mapeia nome da tool -> ToolHandler
   */
  private readonly toolRegistry: ToolRegistry = {};

  constructor(private readonly planHandlers: PlanToolHandlers) {
    this.logger.log('🔧 [REGISTRY] Inicializando ToolRegistryService...');
    this.registerTools();
    this.logger.log(
      '✅ [REGISTRY] ToolRegistryService inicializado com sucesso',
    );
  }

  /**
   * 🔧 REGISTRO DE TOOLS - Registra todas as tools disponíveis
   *
   * FLUXO:
   * 1. Registra tools de planos (create_plan, get_plans)
   * 2. Loga tools registradas
   * 3. Exibe definições ChatCompletionTool
   *
   * TOOLS REGISTRADAS:
   * - create_plan: Criação de novos planos
   * - get_plans: Listagem de planos existentes
   */
  private registerTools(): void {
    this.logger.log('🔧 [REGISTRO] Iniciando registro de tools...');

    // Registrar tools de planos
    this.toolRegistry['create_plan'] = this.planHandlers.createPlan;
    this.toolRegistry['get_plans'] = this.planHandlers.getPlans;

    this.logger.log(
      `🔧 [REGISTRO] Tools registradas: ${Object.keys(this.toolRegistry).length}`,
    );
    this.logger.log(
      `🔧 [REGISTRO] Lista de tools: ${Object.keys(this.toolRegistry).join(', ')}`,
    );

    // Logar definições ChatCompletionTool
    const chatCompletionTools = this.getChatCompletionTools();
    this.logger.log(
      '🔧 [REGISTRO] Definições ChatCompletionTool:',
      JSON.stringify(chatCompletionTools, null, 2),
    );

    this.logger.log('✅ [REGISTRO] Registro de tools concluído');
  }

  /**
   * 🎯 OBTER TOOL ESPECÍFICA - Busca uma tool pelo nome
   *
   * @param name Nome da tool a ser buscada
   * @returns ToolHandler se encontrada, undefined caso contrário
   */
  getTool(name: string): ToolHandler | undefined {
    this.logger.log(`🔍 [BUSCA] Buscando tool: "${name}"`);

    const tool = this.toolRegistry[name];

    if (tool) {
      this.logger.log(`✅ [BUSCA] Tool "${name}" encontrada`);
    } else {
      this.logger.warn(`⚠️ [BUSCA] Tool "${name}" não encontrada`);
    }

    return tool;
  }

  /**
   * 📋 OBTER TODAS AS TOOLS - Retorna o registro completo
   *
   * @returns ToolRegistry com todas as tools registradas
   */
  getAllTools(): ToolRegistry {
    this.logger.log(
      `📋 [LISTA] Obtendo todas as tools (${Object.keys(this.toolRegistry).length} tools)`,
    );
    return this.toolRegistry;
  }

  /**
   * 🔄 CONVERTER PARA CHATCOMPLETIONTOOL - Transforma tools para formato OpenAI
   *
   * FLUXO:
   * 1. Itera sobre todas as tools registradas
   * 2. Converte cada tool usando toChatCompletionTool
   * 3. Retorna array de ChatCompletionTool
   *
   * @returns Array de ChatCompletionTool para uso com OpenAI
   */
  getChatCompletionTools(): ChatCompletionTool[] {
    this.logger.log(
      '🔄 [CONVERSÃO] Convertendo tools para formato ChatCompletionTool...',
    );

    const tools = Object.values(this.toolRegistry).map(toChatCompletionTool);

    this.logger.log(`🔄 [CONVERSÃO] ${tools.length} tools convertidas`);
    this.logger.log(
      `🔄 [CONVERSÃO] Tools convertidas:`,
      JSON.stringify(tools, null, 2),
    );

    return tools;
  }

  /**
   * 🛠️ EXECUTAR TOOL - Executa uma tool específica com argumentos
   *
   * FLUXO:
   * 1. Busca a tool pelo nome
   * 2. Valida se a tool existe
   * 3. Executa o handler da tool
   * 4. Retorna o resultado
   *
   * @param name Nome da tool a ser executada
   * @param args Argumentos para a tool (objeto parseado)
   * @param context Contexto adicional (opcional)
   * @returns Resultado da execução da tool
   * @throws Error se a tool não for encontrada
   */
  async executeTool(
    name: string,
    args: object,
    context?: ToolContext,
  ): Promise<any> {
    this.logger.log(`🛠️ [EXECUÇÃO] Iniciando execução da tool: "${name}"`);
    this.logger.log(
      `🛠️ [EXECUÇÃO] Argumentos recebidos:`,
      JSON.stringify(args, null, 2),
    );

    const tool = this.getTool(name);

    if (!tool) {
      const errorMsg = `Tool '${name}' não encontrada`;
      this.logger.error(`❌ [EXECUÇÃO] ${errorMsg}`);
      this.logger.error(
        `❌ [EXECUÇÃO] Tools disponíveis: ${this.listAvailableTools().join(', ')}`,
      );
      throw new Error(errorMsg);
    }

    this.logger.log(`🛠️ [EXECUÇÃO] Tool encontrada, executando handler...`);

    try {
      const result = await tool.handler(args, context);

      this.logger.log(`✅ [EXECUÇÃO] Tool "${name}" executada com sucesso`);
      this.logger.log(
        `✅ [EXECUÇÃO] Resultado:`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ [EXECUÇÃO] Erro ao executar tool "${name}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * 📊 LISTAR TOOLS DISPONÍVEIS - Retorna lista de nomes das tools
   *
   * @returns Array com nomes de todas as tools registradas
   */
  listAvailableTools(): string[] {
    const tools = Object.keys(this.toolRegistry);
    this.logger.log(`📊 [LISTA] Tools disponíveis: ${tools.length} tools`);
    this.logger.log(`📊 [LISTA] Nomes: ${tools.join(', ')}`);
    return tools;
  }

  /**
   * 🔍 VERIFICAR EXISTÊNCIA - Verifica se uma tool existe
   *
   * @param name Nome da tool a ser verificada
   * @returns true se a tool existe, false caso contrário
   */
  hasTool(name: string): boolean {
    const exists = name in this.toolRegistry;
    this.logger.log(`🔍 [VERIFICAÇÃO] Tool "${name}" existe: ${exists}`);
    return exists;
  }

  /**
   * 📈 ESTATÍSTICAS - Obtém informações sobre o registro
   *
   * @returns Estatísticas do registro de tools
   */
  getStats(): { totalTools: number; toolNames: string[] } {
    const totalTools = Object.keys(this.toolRegistry).length;
    const toolNames = Object.keys(this.toolRegistry);

    this.logger.log(`📈 [STATS] Total de tools: ${totalTools}`);
    this.logger.log(`📈 [STATS] Tools: ${toolNames.join(', ')}`);

    return { totalTools, toolNames };
  }
}
