import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação Swagger para GET /me/services
 */
export function MeServicesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'List my services (id + name)',
      description:
        'Lista serviços do estabelecimento. Requer query establishmentId. Retorna apenas id e name para seletores.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de serviços',
      type: [MeIdNameDto],
    }),
    ApiResponse({
      status: 404,
      description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
      },
    }),
    ApiResponse({
      status: 403,
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
      },
    }),
  );
}
