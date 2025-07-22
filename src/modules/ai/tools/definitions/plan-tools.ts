import { Logger } from '@nestjs/common';

import { ToolDefinition } from '../types/tool-definition.types';

/**
 * 📋 Definições das Tools de Planos - Function Calling para Planos
 *
 * RESPONSABILIDADES:
 * 1. Definir tools para gerenciamento de planos
 * 2. Especificar parâmetros e validações
 * 3. Fornecer descrições claras para a IA
 * 4. Seguir padrões da OpenAI para function calling
 *
 * ESTRUTURA:
 * - create_plan: Criação de novos planos
 * - get_plans: Listagem de planos existentes
 *
 * USO NO SISTEMA:
 * - Importado pelo ToolRegistryService
 * - Usado para registro automático de tools
 * - Referenciado pelos handlers correspondentes
 */
const logger = new Logger('PlanToolsDefinitions');

/**
 * 📋 DEFINIÇÕES DAS TOOLS DE PLANOS
 *
 * Array com todas as definições de tools relacionadas
 * ao gerenciamento de planos de barbearia.
 *
 * TOOLS INCLUÍDAS:
 * - create_plan: Cria novos planos
 * - get_plans: Lista planos existentes
 *
 * @example
 * ```typescript
 * import { PLAN_TOOLS } from './plan-tools';
 *
 * // Registrar tools de planos
 * PLAN_TOOLS.forEach(tool => {
 *   toolRegistry.register(tool);
 * });
 * ```
 */
export const PLAN_TOOLS: ToolDefinition[] = [
  {
    name: 'create_plan',
    description:
      'Cria um novo plano de barbearia. Use esta função sempre que o usuário pedir para criar um novo plano. Nunca responda diretamente sem consultar esta função.',
    parameters: {
      name: {
        type: 'string',
        description: 'Nome do plano (ex: "Plano Premium", "Plano Básico")',
      },
      description: {
        type: 'string',
        description: 'Descrição detalhada do plano e seus benefícios',
      },
      price: {
        type: 'number',
        description: 'Preço do plano em reais (ex: 99.99 para R$ 99,99)',
      },
      duration: {
        type: 'number',
        description: 'Duração do plano em dias (ex: 30 para 30 dias)',
      },
      isActive: {
        type: 'boolean',
        description: 'Se o plano está ativo e disponível para clientes',
      },
    },
    required: ['name', 'description', 'price', 'duration', 'isActive'],
  },
  {
    name: 'get_plans',
    description:
      'Lista todos os planos disponíveis. Use esta função sempre que o usuário pedir para ver, listar ou consultar planos. Nunca responda diretamente sem consultar esta função.',
    parameters: {
      page: {
        type: 'number',
        description: 'Página atual para paginação (opcional, padrão: 1)',
      },
      limit: {
        type: 'number',
        description: 'Limite de itens por página (opcional, padrão: 10)',
      },
    },
    required: [],
  },
];

/**
 * 📊 ESTATÍSTICAS DAS TOOLS DE PLANOS
 *
 * Fornece informações sobre as tools de planos
 * disponíveis no sistema.
 *
 * @returns Estatísticas das tools de planos
 *
 * @example
 * ```typescript
 * const stats = getPlanToolsStats();
 * console.log(`Tools de planos: ${stats.totalTools}`);
 * console.log(`Tools: ${stats.toolNames.join(', ')}`);
 * ```
 */
export function getPlanToolsStats() {
  const totalTools = PLAN_TOOLS.length;
  const toolNames = PLAN_TOOLS.map((tool) => tool.name);
  const toolsWithParams = PLAN_TOOLS.map((tool) => ({
    name: tool.name,
    parameters: Object.keys(tool.parameters),
    required: tool.required || [],
  }));

  const stats = {
    totalTools,
    toolNames,
    toolsWithParams,
    categories: ['plan'],
  };

  logger.log(
    `📊 [PLANOS] Estatísticas das tools de planos:`,
    JSON.stringify(stats, null, 2),
  );

  return stats;
}

/**
 * 🔍 VALIDAR TOOLS DE PLANOS
 *
 * Valida se as definições das tools de planos estão corretas,
 * verificando estrutura, parâmetros e tipos.
 *
 * @returns Array com erros encontrados (vazio se tudo OK)
 *
 * @example
 * ```typescript
 * const errors = validatePlanTools();
 * if (errors.length > 0) {
 *   console.error('Erros nas tools de planos:', errors);
 * }
 * ```
 */
export function validatePlanTools(): string[] {
  const errors: string[] = [];

  logger.log(
    `🔍 [VALIDAÇÃO] Iniciando validação de ${PLAN_TOOLS.length} tools de planos`,
  );

  PLAN_TOOLS.forEach((tool, index) => {
    // Validar nome
    if (!tool.name || typeof tool.name !== 'string') {
      errors.push(`Tool de plano ${index}: nome inválido ou ausente`);
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

    // Validar tipos de parâmetros
    Object.entries(tool.parameters).forEach(([paramName, paramDef]) => {
      if (
        !paramDef.type ||
        !['string', 'number', 'boolean', 'object', 'array'].includes(
          paramDef.type,
        )
      ) {
        errors.push(`Tool ${tool.name}, parâmetro ${paramName}: tipo inválido`);
      }
      if (!paramDef.description || typeof paramDef.description !== 'string') {
        errors.push(
          `Tool ${tool.name}, parâmetro ${paramName}: descrição inválida ou ausente`,
        );
      }
    });
  });

  if (errors.length === 0) {
    logger.log(
      `✅ [VALIDAÇÃO] Todas as ${PLAN_TOOLS.length} tools de planos são válidas`,
    );
  } else {
    logger.error(
      `❌ [VALIDAÇÃO] Encontrados ${errors.length} erros nas tools de planos:`,
      errors,
    );
  }

  return errors;
}

/**
 * 📋 LISTAR TOOLS DE PLANOS
 *
 * Retorna uma lista detalhada de todas as tools
 * de planos com seus parâmetros.
 *
 * @returns Lista detalhada das tools de planos
 *
 * @example
 * ```typescript
 * const planTools = listPlanTools();
 * console.log('Tools disponíveis:', planTools.map(t => t.name));
 * ```
 */
export function listPlanTools() {
  const tools = PLAN_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: Object.entries(tool.parameters).map(([name, def]) => ({
      name,
      type: def.type,
      description: def.description,
      required: (tool.required || []).includes(name),
    })),
    required: tool.required || [],
  }));

  logger.log(`📋 [LISTA] Tools de planos:`, JSON.stringify(tools, null, 2));

  return tools;
}

/**
 * 🔍 BUSCAR TOOL POR NOME
 *
 * Busca uma tool específica de planos pelo nome.
 *
 * @param name Nome da tool a ser buscada
 * @returns Tool encontrada ou undefined
 *
 * @example
 * ```typescript
 * const createPlanTool = findPlanTool('create_plan');
 * if (createPlanTool) {
 *   console.log('Tool encontrada:', createPlanTool.name);
 * }
 * ```
 */
export function findPlanTool(name: string): ToolDefinition | undefined {
  const tool = PLAN_TOOLS.find((t) => t.name === name);

  if (tool) {
    logger.log(`🔍 [BUSCA] Tool de plano encontrada: "${name}"`);
  } else {
    logger.warn(`⚠️ [BUSCA] Tool de plano não encontrada: "${name}"`);
  }

  return tool;
}

// Logs de inicialização
logger.log(`📋 [PLANOS] Definições de tools de planos carregadas`);
logger.log(`📋 [PLANOS] Total de tools: ${PLAN_TOOLS.length}`);
logger.log(`📋 [PLANOS] Tools: ${PLAN_TOOLS.map((t) => t.name).join(', ')}`);

// Validar definições na inicialização
const validationErrors = validatePlanTools();
if (validationErrors.length > 0) {
  logger.error(
    `❌ [PLANOS] Erros de validação encontrados na inicialização:`,
    validationErrors,
  );
} else {
  logger.log(`✅ [PLANOS] Todas as definições de tools de planos são válidas`);
}
