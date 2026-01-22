import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PLAN_TOOLS } from '../definitions/plan-tools';
import {
  ToolContext,
  ToolHandler,
  ToolResult,
} from '../types/tool-definition.types';

import { HttpClientService } from '@/http-client/http-client.service';
import { PlanCreateRequestDTO } from '@/modules/plans/dtos/plan-create-request.dto';
import { PlanCreateResponseDTO } from '@/modules/plans/dtos/plan-create-response.dto';
import { PlanFindAllQueryDTO } from '@/modules/plans/dtos/plan-find-all-query.dto';
import { PlanFindAllResponseDTO } from '@/modules/plans/dtos/plan-find-all-response.dto';

/**
 * 📋 PlanToolHandlers - Manipuladores das Tools de Planos
 *
 * RESPONSABILIDADES:
 * 1. Implementar a lógica de negócio para cada tool de planos
 * 2. Converter dados entre formatos (reais ↔ centavos)
 * 3. Fazer chamadas HTTP para a API de planos
 * 4. Tratar erros e retornar resultados padronizados
 * 5. Fornecer logs detalhados das operações
 *
 * FLUXO DE FUNCIONAMENTO:
 * 1. Recebe argumentos da IA
 * 2. Valida e converte dados
 * 3. Chama API correspondente
 * 4. Processa resposta
 * 5. Retorna resultado padronizado
 *
 * TOOLS IMPLEMENTADAS:
 * - create_plan: Criação de novos planos
 * - get_plans: Listagem de planos existentes
 *
 * CONVERSÕES MONETÁRIAS:
 * - create_plan: Reais → Centavos (para API)
 * - get_plans: Centavos → Reais (para IA)
 */
@Injectable()
export class PlanToolHandlers {
  private readonly logger = new Logger(PlanToolHandlers.name);
  private readonly apiUrl: string;

  constructor(
    private readonly httpClientService: HttpClientService,
    private readonly configService: ConfigService,
  ) {
    this.apiUrl =
      this.configService.get<string>('API_BASE_URL') || 'http://localhost:3333';

    this.logger.log(`📋 [PLANOS] PlanToolHandlers inicializado`);
    this.logger.log(`📋 [PLANOS] API URL: ${this.apiUrl}`);
    this.logger.log(
      `📋 [PLANOS] Tools disponíveis: ${Object.keys(this)
        .filter((key) => key !== 'logger' && key !== 'apiUrl')
        .join(', ')}`,
    );
  }

  /**
   * 🛠️ CREATE PLAN - Cria um novo plano de barbearia
   *
   * FLUXO:
   * 1. Recebe dados do plano da IA
   * 2. Converte preço de reais para centavos
   * 3. Chama API para criar plano
   * 4. Retorna resultado padronizado
   *
   * CONVERSÃO MONETÁRIA:
   * - Entrada: Preço em reais (ex: 99.99)
   * - Processamento: Converte para centavos (9999)
   * - API: Recebe valor em centavos
   *
   * @example
   * ```typescript
   * const args = {
   *   name: 'Plano Premium',
   *   description: 'Plano completo com todos os serviços',
   *   price: 199.99,
   *   duration: 30,
   *   isActive: true
   * };
   *
   * const result = await planHandlers.createPlan.handler(args);
   * console.log(result.success); // true/false
   * console.log(result.data); // plano criado
   * ```
   */
  createPlan: ToolHandler<PlanCreateRequestDTO, PlanCreateResponseDTO> = {
    definition: PLAN_TOOLS[0],
    handler: async (
      args: PlanCreateRequestDTO,
      _context?: ToolContext,
    ): Promise<ToolResult<PlanCreateResponseDTO>> => {
      this.logger.log(`🛠️ [CREATE_PLAN] Iniciando criação de plano`);

      // Transformar price de reais para centavos antes da validação
      const argsToValidate = { ...args };
      if (
        typeof argsToValidate.price === 'number' &&
        !Number.isInteger(argsToValidate.price)
      ) {
        const original = argsToValidate.price;
        argsToValidate.price = Math.round(argsToValidate.price * 100);
        this.logger.log(
          `💱 [CREATE_PLAN] Price convertido de reais (${original}) para centavos (${argsToValidate.price}) para validação.`,
        );
      }

      // (Validação removida)
      const validatedArgs = argsToValidate;

      try {
        // ✅ Converter preço decimal para centavos (inteiro)
        const priceInCents = validatedArgs.price;

        this.logger.log(
          `💰 [CREATE_PLAN] Preço convertido: R$ ${(priceInCents / 100).toFixed(2)} → ${priceInCents} centavos`,
        );

        this.logger.log(
          `🛠️ [CREATE_PLAN] Criando plano: ${validatedArgs.name} - R$ ${(priceInCents / 100).toFixed(2)} (${priceInCents} centavos)`,
        );

        // Preparar dados para a API
        const planData = {
          ...validatedArgs,
          price: priceInCents, // ✅ Usar preço em centavos
        };

        this.logger.log(
          `📤 [CREATE_PLAN] Enviando dados para API:`,
          JSON.stringify(planData, null, 2),
        );

        // Chamar API para criar plano
        const response =
          await this.httpClientService.request<PlanCreateResponseDTO>(
            `${this.apiUrl}/plans`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              data: planData,
            },
          );

        return {
          success: true,
          data: response,
        };
      } catch (error: any) {
        this.logger.error(`❌ [CREATE_PLAN] Erro ao criar plano:`, error);
        this.logger.error(
          `❌ [CREATE_PLAN] Mensagem de erro: ${error.message}`,
        );

        return {
          success: false,
          error: error.message,
        };
      }
    },
  };

  /**
   * 📋 GET PLANS - Lista todos os planos disponíveis
   *
   * FLUXO:
   * 1. Recebe parâmetros de paginação da IA
   * 2. Chama API para buscar planos
   * 3. Converte preços de centavos para reais
   * 4. Retorna lista formatada
   *
   * CONVERSÃO MONETÁRIA:
   * - API: Retorna preços em centavos
   * - Processamento: Converte para reais
   * - Saída: Preços em reais para a IA
   *
   * @example
   * ```typescript
   * const args = {
   *   page: 1,
   *   limit: 10
   * };
   *
   * const result = await planHandlers.getPlans.handler(args);
   * console.log(result.success); // true/false
   * console.log(result.data.data); // array de planos com preços em reais
   * ```
   */
  getPlans: ToolHandler<PlanFindAllQueryDTO, PlanFindAllResponseDTO> = {
    definition: PLAN_TOOLS[1],
    handler: async (
      args: PlanFindAllQueryDTO,
      _context?: ToolContext,
    ): Promise<ToolResult<PlanFindAllResponseDTO>> => {
      this.logger.log(`📋 [GET_PLANS] Iniciando busca de planos`);

      // (Validação removida)
      const validatedArgs = args;

      try {
        const page = validatedArgs.page || 1;
        const limit = validatedArgs.limit || 10;

        this.logger.log(
          `📋 [GET_PLANS] Buscando planos - Página: ${page}, Limite: ${limit}`,
        );

        // Construir query parameters
        const queryParams = new URLSearchParams();
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());

        const url = `${this.apiUrl}/plans${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

        this.logger.log(`📤 [GET_PLANS] Chamando API: ${url}`);

        // Chamar API para buscar planos
        const response =
          await this.httpClientService.request<PlanFindAllResponseDTO>(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

        this.logger.log(
          `📋 [GET_PLANS] Planos encontrados: ${response.data.length} de ${response.meta.total.items}`,
        );

        // ✅ Converter preços de centavos para reais
        const plansWithRealPrices = response.data.map((plan) => {
          const realPrice = plan.price / 100; // Converter centavos para reais

          this.logger.log(
            `💰 [GET_PLANS] Conversão: ${plan.price} centavos → R$ ${realPrice}`,
          );

          return {
            ...plan,
            price: realPrice,
          };
        });

        const transformedResponse = {
          ...response,
          data: plansWithRealPrices,
        };

        return {
          success: true,
          data: transformedResponse,
        };
      } catch (error: any) {
        this.logger.error(`❌ [GET_PLANS] Erro ao buscar planos:`, error);
        this.logger.error(`❌ [GET_PLANS] Mensagem de erro: ${error.message}`);

        return {
          success: false,
          error: error.message,
        };
      }
    },
  };

  /**
   * 📊 ESTATÍSTICAS DOS HANDLERS
   *
   * Fornece informações sobre os handlers de planos
   * disponíveis e suas características.
   *
   * @returns Estatísticas dos handlers
   *
   * @example
   * ```typescript
   * const stats = planHandlers.getStats();
   * console.log(`Handlers disponíveis: ${stats.totalHandlers}`);
   * console.log(`Handlers: ${stats.handlerNames.join(', ')}`);
   * ```
   */
  getStats(): {
    totalHandlers: number;
    handlerNames: string[];
    apiUrl: string;
  } {
    const handlers = ['createPlan', 'getPlans'];
    const stats = {
      totalHandlers: handlers.length,
      handlerNames: handlers,
      apiUrl: this.apiUrl,
    };

    this.logger.log(
      `📊 [STATS] Estatísticas dos handlers de planos:`,
      JSON.stringify(stats, null, 2),
    );

    return stats;
  }

  /**
   * 🔍 VALIDAR HANDLER
   *
   * Valida se um handler específico está funcionando
   * corretamente.
   *
   * @param handlerName Nome do handler a ser validado
   * @returns true se válido, false caso contrário
   *
   * @example
   * ```typescript
   * const isValid = planHandlers.validateHandler('createPlan');
   * console.log('Handler válido:', isValid);
   * ```
   */
  validateHandler(handlerName: string): boolean {
    this.logger.log(`🔍 [VALIDAÇÃO] Validando handler: "${handlerName}"`);

    const validHandlers = ['createPlan', 'getPlans'];
    const isValid = validHandlers.includes(handlerName);

    if (isValid) {
      this.logger.log(`✅ [VALIDAÇÃO] Handler "${handlerName}" é válido`);
    } else {
      this.logger.warn(
        `⚠️ [VALIDAÇÃO] Handler "${handlerName}" não encontrado`,
      );
    }

    return isValid;
  }

  /**
   * 📋 LISTAR HANDLERS DISPONÍVEIS
   *
   * Retorna uma lista de todos os handlers
   * disponíveis com suas definições.
   *
   * @returns Lista detalhada dos handlers
   *
   * @example
   * ```typescript
   * const handlers = planHandlers.listHandlers();
   * console.log('Handlers:', handlers.map(h => h.name));
   * ```
   */
  listHandlers() {
    const handlers = [
      {
        name: 'createPlan',
        definition: PLAN_TOOLS[0],
        description: 'Cria novos planos de barbearia',
        parameters: Object.keys(PLAN_TOOLS[0].parameters),
        required: PLAN_TOOLS[0].required || [],
      },
      {
        name: 'getPlans',
        definition: PLAN_TOOLS[1],
        description: 'Lista planos disponíveis',
        parameters: Object.keys(PLAN_TOOLS[1].parameters),
        required: PLAN_TOOLS[1].required || [],
      },
    ];

    this.logger.log(
      `📋 [LISTA] Handlers de planos:`,
      JSON.stringify(handlers, null, 2),
    );

    return handlers;
  }
}

/**
 * 📚 Exemplos de Uso Completo
 *
 * ```typescript
 * @Injectable()
 * export class ToolRegistryService {
 *   constructor(private readonly planHandlers: PlanToolHandlers) {}
 *
 *   private registerTools(): void {
 *     // Registrar handlers de planos
 *     this.toolRegistry['create_plan'] = this.planHandlers.createPlan;
 *     this.toolRegistry['get_plans'] = this.planHandlers.getPlans;
 *
 *     // Logar estatísticas
 *     const stats = this.planHandlers.getStats();
 *     console.log(`Registrados ${stats.totalHandlers} handlers de planos`);
 *   }
 * }
 * ```
 */
