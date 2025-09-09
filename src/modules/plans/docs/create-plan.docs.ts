import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';

/**
 * Documentação completa do endpoint de criação de plano
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /plans
 */
export function CreatePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new plan' }),
    ApiResponse({ status: 201, type: PlanCreateResponseDTO }),
  );
}
