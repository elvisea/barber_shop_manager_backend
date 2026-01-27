import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberSummaryResponseDTO } from '../dtos/member-summary-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de resumo de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /members/:memberId/summary
 */
export function MemberSummaryDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get member summary with relationships',
      description:
        'Retorna um resumo completo do membro incluindo informações sobre serviços, produtos, horários de trabalho e períodos de ausência atribuídos.',
    }),
    ApiResponse({
      status: 200,
      description: 'Resumo do membro retornado com sucesso',
      type: MemberSummaryResponseDTO,
    }),
    ApiNotFoundResponse({
      description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
      schema: {
        example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
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
          {
            example:
              SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
          },
        ],
      },
    }),
  );
}
