import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de cliente
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/customers
 */
export function CreateCustomerDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create customer for establishment' }),
    ApiResponse({ status: 201, type: EstablishmentCustomerCreateResponseDTO }),
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
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
