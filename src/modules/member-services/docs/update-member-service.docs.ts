import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate, getPastDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de serviço de membro
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /members/:memberId/services/:serviceId
 */
export function UpdateMemberServiceDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a service assigned to a member in an establishment',
      description:
        'Atualiza um serviço específico atribuído a um membro em um estabelecimento.',
    }),
    ApiResponse({
      status: 200,
      description: 'Serviço atualizado com sucesso',
      type: MemberServiceCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        memberId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        establishmentId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
        serviceId: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
        price: 6000,
        duration: 45,
        commission: 0.2,
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
