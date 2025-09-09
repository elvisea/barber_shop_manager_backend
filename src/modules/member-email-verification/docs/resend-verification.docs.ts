import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberEmailVerificationResendResponseDTO } from '../dtos/member-email-verification-resend-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de reenvio de verificação de email para membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /member-email-verification/resend
 */
export function ResendMemberVerificationDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reenviar token de verificação de email para membro',
      description:
        'Solicita um novo token de verificação para o email do membro especificado. Útil quando o token anterior expirou.',
    }),
    ApiResponse({
      status: 200,
      description: 'Token reenviado com sucesso',
      type: MemberEmailVerificationResendResponseDTO,
    }),
    ApiResponse({
      status: 404,
      description:
        SwaggerErrors[ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND].example,
      },
    }),
    ApiResponse({
      status: 409,
      description: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].description,
      schema: {
        example: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].example,
      },
    }),
    ApiResponse({
      status: 400,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
