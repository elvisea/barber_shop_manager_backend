import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MemberAuthResponseDTO } from '../dtos/member-auth-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de autenticação de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /member-auth/login
 */
export function MemberLoginDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Authenticate member and return tokens',
      description: 'Autentica um membro e retorna os tokens de acesso.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Autenticação de membro realizada com sucesso',
      type: MemberAuthResponseDTO,
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        member: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'João Silva',
          email: 'joao.silva@barbearia.com',
          phone: '+5511987654321',
          role: 'BARBER',
          establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
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
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
      schema: { example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example },
    }),
  );
}
