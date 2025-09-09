import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SubscriptionCreateResponseDTO } from '../dtos/subscription-create-response.dto';

/**
 * Documentação completa do endpoint de criação de assinatura
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /establishments/:establishmentId/subscriptions
 */
export function CreateSubscriptionDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Create subscription for establishment' }),
    ApiResponse({ status: 201, type: SubscriptionCreateResponseDTO }),
  );
}
