import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate, getPastDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de busca de serviço de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint GET /members/:memberId/services/:serviceId
 */
export function FindOneMemberServiceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a service assigned to a member in an establishment',
      description:
        'Busca um serviço específico atribuído a um membro em um estabelecimento.',
    }),
    ApiResponse({
      status: 200,
      description: 'Serviço encontrado com sucesso',
      type: MemberServiceFindOneResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Corte Masculino',
        description: 'Corte tradicional masculino com acabamento',
        duration: 30,
        price: 5000,
        commission: 0.15,
        createdAt: getPastDate(1),
        updatedAt: getCurrentDate(),
      },
    }),
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
            example: SwaggerErrors[ErrorCode.MEMBER_SERVICE_NOT_FOUND].example,
          },
          {
            example:
              SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
          },
        ],
      },
    }),
  );
}
