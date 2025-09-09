import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Documentação completa do endpoint de webhook
 *
 * Este decorator composto aplica toda a documentação Swagger necessária
 * para o endpoint POST /api/webhook
 */
export function WebhookDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Receber webhook de eventos',
      description: 'Recebe e processa webhooks de eventos externos.',
    }),
    ApiResponse({
      status: 200,
      description: 'Webhook processado com sucesso',
      schema: {
        type: 'string',
        example: 'Webhook recebido com sucesso (roteamento)',
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Dados do webhook inválidos',
      schema: {
        type: 'object',
        example: {
          message: 'Dados do webhook inválidos',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
  );
}
