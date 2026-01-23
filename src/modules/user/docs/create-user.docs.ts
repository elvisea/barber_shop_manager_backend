import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de usuário
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /users
 */
export function CreateUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new user',
      description:
        'Creates a new user account. If the email already exists but is not verified, a new verification token will be sent. If the email is already verified, returns an error.',
    }),
    ApiResponse({
      status: 201,
      description:
        'User created successfully or verification token resent for existing unverified user',
      type: CreateUserResponseDTO,
    }),
    ApiConflictResponse({
      description:
        'Email already exists and is verified. Use EMAIL_ALREADY_EXISTS_VERIFIED error code.',
      schema: {
        example:
          SwaggerErrors[ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED]?.example ||
          SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].example,
      },
    }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiResponse({
      status: 500,
      description: SwaggerErrors[ErrorCode.USER_CREATION_FAILED].description,
      schema: {
        example: SwaggerErrors[ErrorCode.USER_CREATION_FAILED].example,
      },
    }),
  );
}
