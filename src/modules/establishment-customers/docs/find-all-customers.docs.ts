import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentCustomerFindAllResponseDTO } from '../dtos/establishment-customer-find-all-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de listagem de clientes
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/customers
 */
export function FindAllCustomersDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find all customers (paginated)' }),
    ApiResponse({ status: 200, type: EstablishmentCustomerFindAllResponseDTO }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiForbiddenResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
            .example,
      },
    }),
  );
}
