import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberResponseDTO } from '../dtos';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/members
 */
export function CreateMemberDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new member' }),
    ApiResponse({ status: 201, type: MemberResponseDTO }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].example,
      },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].example,
      },
    }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
      },
    }),
    ApiForbiddenResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
      schema: {
        oneOf: [
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
          },
        ],
      },
    }),
  );
}
