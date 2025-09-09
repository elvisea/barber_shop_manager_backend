import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de exclusão de cliente
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint DELETE /establishments/:establishmentId/customers/:customerId
 */
export function DeleteCustomerDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete customer by ID' }),
    ApiNoContentResponse({ description: 'Customer deleted successfully' }),
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
