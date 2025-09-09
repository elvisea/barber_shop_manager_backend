import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de cliente por ID
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /establishments/:establishmentId/customers/:customerId
 */
export function FindCustomerByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Find customer by ID' }),
    ApiResponse({ status: 200, type: EstablishmentCustomerCreateResponseDTO }),
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
    ApiNotFoundResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND].example,
      },
    }),
  );
}
