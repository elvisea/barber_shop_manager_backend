import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de autenticação
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /user-auth/login
 */
export function LoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Authenticate user and return tokens',
      description: 'Autentica um usuário e retorna os tokens de acesso.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Autenticação realizada com sucesso',
      type: CreateAuthResponseDTO,
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+5511987654321',
          createdAt: getCurrentDate(),
          updatedAt: getCurrentDate(),
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description:
        SwaggerErrors[ErrorCode.INVALID_EMAIL_OR_PASSWORD].description,
      schema: {
        example: SwaggerErrors[ErrorCode.INVALID_EMAIL_OR_PASSWORD].example,
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
