import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de listagem de estabelecimentos
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments
 */
export function FindAllEstablishmentsDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find establishments (paginated)' }),
    ApiResponse({ status: 200, type: EstablishmentFindAllResponseDTO }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
