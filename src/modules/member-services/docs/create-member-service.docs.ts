import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atribuição de serviço a membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /members/:memberId/services/:serviceId
 */
export function CreateMemberServiceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Assign a service to a member in an establishment',
    }),
    ApiResponse({ status: 201, type: MemberServiceCreateResponseDTO }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
                .example,
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND].example,
          },
        ],
      },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS].example,
      },
    }),
  );
}
