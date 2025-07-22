/**
 * 🎯 Prompt Centralizado para IA - Luna, Assistente Virtual da Barbearia
 *
 * Este arquivo centraliza o prompt usado pela IA em todos os serviços,
 * garantindo consistência e facilitando manutenção.
 *
 * HISTÓRICO DE VERSÕES:
 * - v1.0.0: Prompt inicial básico
 * - v2.0.0: Adicionado function calling
 * - v3.0.0: Melhorado para evitar descrições de funções
 * - v3.1.0: Refinado para ser mais direto
 * - v3.2.0: Ajustado para melhor function calling
 * - v3.3.0: Versão atual - otimizada para function calling direto
 *
 * CARACTERÍSTICAS:
 * - Instruções claras sobre quando usar functions
 * - Proibição de descrever functions
 * - Foco em chamadas diretas de functions
 * - Tom amigável e profissional
 *
 * USO NO SISTEMA:
 * - Enviado como mensagem 'system' para a IA
 * - Define o comportamento base da Luna
 * - Controla quando e como usar function calling
 * - Mantém consistência em todas as conversas
 */

/**
 * 🎭 PROMPT PRINCIPAL - Instruções para a IA Luna
 *
 * ESTRUTURA:
 * - prompt: Instrução principal em inglês
 * - directives: Lista de diretrizes específicas
 *
 * FUNCIONAMENTO:
 * 1. Define a personalidade da Luna
 * 2. Especifica quando usar functions
 * 3. Proíbe descrições de functions
 * 4. Mantém tom natural para conversas gerais
 *
 * FUNCTION CALLING:
 * - get_plans: Quando usuário pede para listar/ver/mostrar planos
 * - create_plan: Quando usuário quer criar novo plano
 * - Conversas gerais: Sem function calling
 */
export const BARBER_SHOP_PROMPT = JSON.stringify({
  prompt:
    'You are Luna, a friendly and helpful virtual assistant for a barber shop. You have access to functions to help with plan management. IMPORTANT: When user asks to "listar planos", "ver planos", "mostrar planos", or similar, you MUST call the get_plans function (do not write about it, just call it). When user asks to "criar plano", "novo plano", or provides plan details, you MUST call the create_plan function. For greetings and general conversation, respond naturally without calling any functions. NEVER write about functions or describe what you will do - just call the appropriate function when needed.',
  directives: [
    'Respond naturally to greetings and general conversation.',
    'MUST call get_plans function when user asks to list/see/show plans.',
    'MUST call create_plan function when user wants to create a new plan.',
    'Be polite, friendly and concise.',
    'NEVER write about functions - just call them when needed.',
    'Do not describe what you will do - just do it by calling functions.',
  ],
});

/**
 * 📏 INFORMAÇÕES SOBRE O PROMPT
 *
 * Contém metadados sobre o prompt atual para controle
 * de versão e monitoramento de uso
 */
export const PROMPT_INFO = {
  /** Nome do assistente virtual */
  name: 'Luna - Assistente de Barbearia',

  /** Versão atual do prompt */
  version: '3.3.0',

  /** Número de caracteres do prompt */
  characterCount: BARBER_SHOP_PROMPT.length,

  /** Descrição da versão atual */
  description:
    'Prompt com instruções claras sobre function calling - não escrever sobre funções',

  /** Data da última atualização */
  lastUpdated: '2025-01-21',

  /** Funcionalidades suportadas */
  features: [
    'Function calling para get_plans',
    'Function calling para create_plan',
    'Conversas naturais sem functions',
    'Proibição de descrições de functions',
  ],

  /** Exemplos de uso */
  examples: {
    'Listar planos': 'Usuário: "quero ver os planos" → Luna chama get_plans()',
    'Criar plano': 'Usuário: "criar plano Premium" → Luna chama create_plan()',
    'Conversa geral': 'Usuário: "oi, tudo bem?" → Luna responde naturalmente',
  },
};

/**
 * 📚 EXEMPLOS DE USO DO PROMPT
 *
 * // 1. Uso básico no sistema
 * const messages = [
 *   { role: 'system', content: BARBER_SHOP_PROMPT },
 *   { role: 'user', content: 'Quero ver os planos disponíveis' }
 * ];
 *
 * // 2. Verificar informações do prompt
 * console.log(`Prompt ${PROMPT_INFO.name} v${PROMPT_INFO.version}`);
 * console.log(`Caracteres: ${PROMPT_INFO.characterCount}`);
 *
 * // 3. Log de uso
 * logger.log(`Usando prompt v${PROMPT_INFO.version} - ${PROMPT_INFO.description}`);
 */

/**
 * 🔄 HISTÓRICO DE MUDANÇAS
 *
 * v3.3.0 (2025-01-21):
 * - Otimizado para function calling direto
 * - Removidas ambiguidades no prompt
 * - Melhorada clareza das instruções
 *
 * v3.2.0 (2025-01-20):
 * - Ajustado para melhor function calling
 * - Refinadas as diretrizes
 *
 * v3.1.0 (2025-01-19):
 * - Prompt mais direto e claro
 * - Foco em evitar descrições
 *
 * v3.0.0 (2025-01-18):
 * - Adicionada proibição de descrever functions
 * - Melhorado para function calling
 *
 * v2.0.0 (2025-01-17):
 * - Adicionado suporte a function calling
 * - Integração com tools do sistema
 *
 * v1.0.0 (2025-01-16):
 * - Prompt inicial básico
 * - Conversas simples sem functions
 */
