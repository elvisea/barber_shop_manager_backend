/**
 * 🔧 Interfaces para Function Calling - Sistema de IA
 * 
 * Este arquivo define todas as interfaces necessárias para implementar
 * function calling no sistema de IA, seguindo as boas práticas da OpenAI.
 * 
 * ARQUITETURA:
 * - AIFunctionParameter: Define parâmetros individuais
 * - AIFunctionDefinition: Define uma função completa
 * - AIFunctionCall: Representa uma chamada de função
 * - AIFunctionResult: Resultado da execução
 * - AIFunctionHandler: Combina definição e handler
 */

/**
 * 📋 Parâmetro de Função - Define um parâmetro individual
 * 
 * Segue o padrão JSON Schema para validação de parâmetros
 * Compatível com OpenAI Function Calling
 */
export interface AIFunctionParameter {
  /** Tipo do parâmetro (string, number, boolean, object, array) */
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';

  /** Descrição do parâmetro para a IA */
  description: string;

  /** Valores permitidos (para enum) */
  enum?: string[];

  /** Se o parâmetro é obrigatório */
  required?: boolean;
}

/**
 * 📝 Definição de Função - Define uma função completa para a IA
 * 
 * Contém todas as informações necessárias para a IA entender
 * como chamar a função e quais parâmetros esperar
 */
export interface AIFunctionDefinition {
  /** Nome único da função */
  name: string;

  /** Descrição da função para a IA */
  description: string;

  /** Esquema dos parâmetros (JSON Schema) */
  parameters: {
    /** Tipo sempre 'object' para funções */
    type: 'object';

    /** Propriedades dos parâmetros */
    properties: Record<string, AIFunctionParameter>;

    /** Lista de parâmetros obrigatórios */
    required: string[];

    /** Não permite propriedades adicionais */
    additionalProperties: false;
  };

  /** Se a validação deve ser estrita */
  strict?: boolean;
}

/**
 * 📞 Chamada de Função - Representa uma execução de função
 * 
 * Gerada pela IA quando decide chamar uma função
 * Contém o nome da função e os argumentos fornecidos
 */
export interface AIFunctionCall {
  /** Nome da função a ser executada */
  name: string;

  /** Argumentos fornecidos pela IA */
  arguments: Record<string, any>;
}

/**
 * 📤 Resultado de Função - Resultado da execução
 * 
 * Retornado após executar uma função
 * Indica sucesso/falha e contém dados ou erro
 */
export interface AIFunctionResult {
  /** Se a execução foi bem-sucedida */
  success: boolean;

  /** Dados retornados (se sucesso) */
  data?: any;

  /** Mensagem de erro (se falha) */
  error?: string;
}

/**
 * 🛠️ Handler de Função - Combina definição e implementação
 * 
 * Interface completa que combina a definição da função
 * com sua implementação (handler)
 */
export interface AIFunctionHandler {
  /** Definição da função para a IA */
  definition: AIFunctionDefinition;

  /** Implementação da função */
  handler: (args: Record<string, any>) => Promise<AIFunctionResult>;
}

/**
 * 📚 Exemplos de Uso
 * 
 * // 1. Definir uma função simples
 * const createPlanFunction: AIFunctionDefinition = {
 *   name: 'create_plan',
 *   description: 'Cria um novo plano de barbearia',
 *   parameters: {
 *     type: 'object',
 *     properties: {
 *       name: {
 *         type: 'string',
 *         description: 'Nome do plano',
 *       },
 *       price: {
 *         type: 'number',
 *         description: 'Preço em reais',
 *       },
 *     },
 *     required: ['name', 'price'],
 *     additionalProperties: false,
 *   },
 * };
 * 
 * // 2. Implementar o handler
 * const createPlanHandler: AIFunctionHandler = {
 *   definition: createPlanFunction,
 *   handler: async (args) => {
 *     try {
 *       const result = await createPlan(args);
 *       return { success: true, data: result };
 *     } catch (error) {
 *       return { success: false, error: error.message };
 *     }
 *   },
 * };
 * 
 * // 3. Chamada da IA
 * const functionCall: AIFunctionCall = {
 *   name: 'create_plan',
 *   arguments: { name: 'Plano Premium', price: 99.99 },
 * };
 * 
 * // 4. Execução
 * const result: AIFunctionResult = await createPlanHandler.handler(functionCall.arguments);
 */
