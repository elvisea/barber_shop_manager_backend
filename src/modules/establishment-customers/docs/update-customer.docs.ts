import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentCustomerUpdateResponseDTO } from '../dtos/establishment-customer-update-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de cliente
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /establishments/:establishmentId/customers/:customerId
 */
export function UpdateCustomerDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Update customer by ID' }),
    ApiResponse({ status: 200, type: EstablishmentCustomerUpdateResponseDTO }),
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
    ApiConflictResponse({
      description: 'Conflict: customer email or phone already exists',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[
                ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS
              ].example,
          },
          {
            example:
              SwaggerErrors[
                ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS
              ].example,
          },
        ],
      },
    }),
  );
}
