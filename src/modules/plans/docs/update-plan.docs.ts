import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de plano
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /plans/:id
 */
export function UpdatePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update plan by id' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 200, type: PlanCreateResponseDTO }),
    ApiResponse({
      status: 404,
      description: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].description,
      schema: { example: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].example },
    }),
  );
}
