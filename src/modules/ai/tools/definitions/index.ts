import { Logger } from '@nestjs/common';

import { PLAN_TOOLS } from './plan-tools';

/**
 * 📚 Índice das Definições de Tools - Centralizador de Definições
 *
 * RESPONSABILIDADES:
 * 1. Centralizar todas as definições de tools
 * 2. Fornecer acesso unificado às definições
 * 3. Organizar tools por categoria
 * 4. Facilitar importação e manutenção
 *
 * ESTRUTURA:
 * - Exportações individuais por módulo
 * - Array consolidado de todas as tools
 * - Mapa organizado por categoria
 *
 * USO NO SISTEMA:
 * - Importado pelo ToolRegistryService
 * - Usado para registro automático de tools
 * - Facilita adição de novas categorias
 */
const logger = new Logger('ToolDefinitionsIndex');

/**
 * 🎯 TODAS AS DEFINIÇÕES DE TOOLS DISPONÍVEIS
 *
 * Array consolidado com todas as definições de tools
 * do sistema, organizadas por categoria.
 *
 * CATEGORIAS INCLUÍDAS:
 * - plan: Tools relacionadas a planos de barbearia
 *
 * @example
 * ```typescript
 * import { ALL_TOOL_DEFINITIONS } from './definitions';
 *
 * // Registrar todas as tools
 * ALL_TOOL_DEFINITIONS.forEach(tool => {
 *   toolRegistry.register(tool);
 * });
 * ```
 */
export const ALL_TOOL_DEFINITIONS = [...PLAN_TOOLS];

/**
 * 📋 MAPA DE DEFINIÇÕES POR CATEGORIA
 *
 * Organiza as definições de tools por categoria funcional,
 * facilitando o acesso e manutenção.
 *
 * ESTRUTURA:
 * - plan: Tools de gerenciamento de planos
 * - customer: Tools de clientes (futuro)
 * - appointment: Tools de agendamentos (futuro)
 * - service: Tools de serviços (futuro)
 *
 * @example
 * ```typescript
 * import { TOOL_DEFINITIONS_BY_CATEGORY } from './definitions';
 *
 * // Obter apenas tools de planos
 * const planTools = TOOL_DEFINITIONS_BY_CATEGORY.plan;
 *
 * // Registrar tools por categoria
 * Object.entries(TOOL_DEFINITIONS_BY_CATEGORY).forEach(([category, tools]) => {
 *   console.log(`Registrando ${tools.length} tools da categoria ${category}`);
 * });
 * ```
 */
export const TOOL_DEFINITIONS_BY_CATEGORY = {
  plan: PLAN_TOOLS,
  // customer: CUSTOMER_TOOLS, // Futuro
  // appointment: APPOINTMENT_TOOLS, // Futuro
  // service: SERVICE_TOOLS, // Futuro
};

/**
 * 📊 ESTATÍSTICAS DAS DEFINIÇÕES
 *
 * Fornece informações sobre o total de tools
 * e distribuição por categoria.
 *
 * @returns Estatísticas das definições de tools
 *
 * @example
 * ```typescript
 * const stats = getToolDefinitionsStats();
 * console.log(`Total de tools: ${stats.totalTools}`);
 * console.log(`Categorias: ${stats.categories.join(', ')}`);
 * ```
 */
export function getToolDefinitionsStats() {
  const totalTools = ALL_TOOL_DEFINITIONS.length;
  const categories = Object.keys(TOOL_DEFINITIONS_BY_CATEGORY);
  const toolsByCategory = Object.entries(TOOL_DEFINITIONS_BY_CATEGORY).reduce(
    (acc, [category, tools]) => {
      acc[category] = tools.length;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = {
    totalTools,
    categories,
    toolsByCategory,
    tools: ALL_TOOL_DEFINITIONS.map((tool) => tool.name),
  };

  logger.log(
    `📊 [DEFINIÇÕES] Estatísticas das definições:`,
    JSON.stringify(stats, null, 2),
  );

  return stats;
}

/**
 * 🔍 VALIDAR DEFINIÇÕES
 *
 * Valida se todas as definições de tools estão corretas,
 * verificando estrutura e parâmetros obrigatórios.
 *
 * @returns Array com erros encontrados (vazio se tudo OK)
 *
 * @example
 * ```typescript
 * const errors = validateToolDefinitions();
 * if (errors.length > 0) {
 *   console.error('Erros nas definições:', errors);
 * }
 * ```
 */
export function validateToolDefinitions(): string[] {
  const errors: string[] = [];

  logger.log(
    `🔍 [VALIDAÇÃO] Iniciando validação de ${ALL_TOOL_DEFINITIONS.length} definições`,
  );

  ALL_TOOL_DEFINITIONS.forEach((tool, index) => {
    // Validar nome
    if (!tool.name || typeof tool.name !== 'string') {
      errors.push(`Tool ${index}: nome inválido ou ausente`);
    }

    // Validar descrição
    if (!tool.description || typeof tool.description !== 'string') {
      errors.push(`Tool ${tool.name}: descrição inválida ou ausente`);
    }

    // Validar parâmetros
    if (!tool.parameters || typeof tool.parameters !== 'object') {
      errors.push(`Tool ${tool.name}: parâmetros inválidos ou ausentes`);
    }

    // Validar required
    if (tool.required && !Array.isArray(tool.required)) {
      errors.push(`Tool ${tool.name}: campo 'required' deve ser um array`);
    }
  });

  if (errors.length === 0) {
    logger.log(
      `✅ [VALIDAÇÃO] Todas as ${ALL_TOOL_DEFINITIONS.length} definições são válidas`,
    );
  } else {
    logger.error(
      `❌ [VALIDAÇÃO] Encontrados ${errors.length} erros nas definições:`,
      errors,
    );
  }

  return errors;
}

/**
 * 📋 LISTAR TOOLS POR CATEGORIA
 *
 * Retorna uma lista organizada de todas as tools
 * agrupadas por categoria.
 *
 * @returns Mapa com tools organizadas por categoria
 *
 * @example
 * ```typescript
 * const toolsByCategory = listToolsByCategory();
 * console.log('Tools de planos:', toolsByCategory.plan.map(t => t.name));
 * ```
 */
export function listToolsByCategory() {
  const result = Object.entries(TOOL_DEFINITIONS_BY_CATEGORY).reduce(
    (acc, [category, tools]) => {
      acc[category] = tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: Object.keys(tool.parameters),
        required: tool.required || [],
      }));
      return acc;
    },
    {} as Record<string, any[]>,
  );

  logger.log(
    `📋 [LISTA] Tools por categoria:`,
    JSON.stringify(result, null, 2),
  );

  return result;
}

// Logs de inicialização
logger.log(`📚 [DEFINIÇÕES] Índice de definições carregado`);
logger.log(`📚 [DEFINIÇÕES] Total de tools: ${ALL_TOOL_DEFINITIONS.length}`);
logger.log(
  `📚 [DEFINIÇÕES] Categorias: ${Object.keys(TOOL_DEFINITIONS_BY_CATEGORY).join(', ')}`,
);

// Exportar todas as definições individuais
export * from './plan-tools';
