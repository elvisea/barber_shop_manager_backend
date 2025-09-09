import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SubscriptionCreateResponseDTO } from '../dtos/subscription-create-response.dto';

/**
 * Documentação completa do endpoint de criação de assinatura
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/subscriptions
 */
export function CreateSubscriptionDocs() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create subscription for establishment',
      description:
        'Cria uma nova assinatura para um estabelecimento específico.',
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Assinatura criada com sucesso',
      type: SubscriptionCreateResponseDTO,
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        establishmentId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
        planId: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
        status: 'ACTIVE',
        startDate: '2023-10-27T10:00:00.000Z',
        endDate: '2023-11-27T10:00:00.000Z',
        createdAt: '2023-10-27T10:00:00.000Z',
        updatedAt: '2023-10-27T10:00:00.000Z',
      },
    }),
  );
}
