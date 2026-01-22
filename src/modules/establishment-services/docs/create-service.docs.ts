import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';

import { SwaggerErrors } from '@/common/swagger-errors';
import { getCurrentDate } from '@/common/utils/date-helpers';
import { ErrorCode } from '@/enums/error-code';

/**
 * Documentação completa do endpoint de criação de serviço para um estabelecimento
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/services
 */
export function CreateServiceDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new establishment service',
      description: 'Cria um novo serviço para um estabelecimento específico.',
    }),
    ApiResponse({
      status: 201,
      description: 'Serviço criado com sucesso',
      type: EstablishmentServiceCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Corte de Cabelo',
        description: 'Corte de cabelo masculino',
        price: 50.0,
        duration: 60,
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        createdAt: getCurrentDate(),
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
