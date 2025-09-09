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
    ApiOperation({ summary: 'Create new user' }),
    ApiResponse({
      status: 201,
      description: 'User created successfully',
      type: CreateUserResponseDTO,
    }),
    ApiConflictResponse({
      description: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].description,
      schema: { example: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].example },
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
