import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MemberVerifyEmailResponseDto } from '../dtos/member-verify-email-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de verificação de email de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /members/email-verification/verify
 */
export function VerifyMemberEmailDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify member email',
      description:
        'Verifica o email do membro usando o código de verificação enviado por email.',
    }),
    ApiResponse({
      status: 200,
      type: MemberVerifyEmailResponseDto,
      description: 'Email verificado com sucesso',
    }),
    ApiResponse({
      status: 400,
      description:
        SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].description,
      schema: {
        example: SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].example,
      },
    }),
    ApiResponse({
      status: 404,
      description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
      schema: { example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example },
    }),
    ApiResponse({
      status: 400,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
