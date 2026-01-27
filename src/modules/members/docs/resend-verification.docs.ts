import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MemberResendVerificationResponseDto } from '../dtos/member-resend-verification-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de reenvio de código de verificação de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /members/email-verification/resend
 */
export function ResendMemberVerificationDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend verification code for member',
      description:
        'Reenvia um novo código de verificação para o email do membro.',
    }),
    ApiResponse({
      status: 200,
      type: MemberResendVerificationResponseDto,
      description: 'Novo código de verificação enviado com sucesso',
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
