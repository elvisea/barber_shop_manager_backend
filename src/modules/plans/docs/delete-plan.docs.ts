import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de exclusão de plano
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /plans/:id
 */
export function DeletePlanDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete plan by id' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({ status: 204, description: 'Plan deleted successfully' }),
    ApiResponse({
      status: 404,
      description: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].description,
      schema: { example: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].example },
    }),
  );
}
