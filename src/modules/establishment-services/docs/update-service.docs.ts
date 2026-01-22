import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate, getPastDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de atualização de serviço
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint PATCH /establishments/:establishmentId/services/:serviceId
 */
export function UpdateServiceDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update service by ID',
      description:
        'Atualiza um serviço específico de um estabelecimento pelo ID.',
    }),
    ApiResponse({
      status: 200,
      description: 'Serviço atualizado com sucesso',
      type: EstablishmentServiceCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Corte de Cabelo Atualizado',
        description: 'Corte de cabelo masculino - versão melhorada',
        price: 60.0,
        duration: 75,
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        createdAt: getPastDate(1),
        updatedAt: getCurrentDate(),
      },
    }),
    ApiBadRequestResponse({
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
    ApiForbiddenResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
            .example,
      },
    }),
    ApiNotFoundResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND].description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND].example,
      },
    }),
    ApiConflictResponse({
      description:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]
          .description,
      schema: {
        example:
          SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]
            .example,
      },
    }),
  );
}
