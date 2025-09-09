import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PlanFindAllResponseDTO } from '../dtos/plan-find-all-response.dto';

/**
 * Documentação completa do endpoint de listagem de planos
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /plans
 */
export function FindAllPlansDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'List all plans (paginated)' }),
    ApiResponse({ status: 200, type: PlanFindAllResponseDTO }),
  );
}
