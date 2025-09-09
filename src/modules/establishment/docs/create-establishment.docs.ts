import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de estabelecimento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments
 */
export function CreateEstablishmentDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new establishment' }),
    ApiResponse({ status: 201, type: EstablishmentFindOneResponseDTO }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS].example,
      },
    }),
  );
}
