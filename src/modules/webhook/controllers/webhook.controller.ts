import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { WebhookLogDataDTO } from '../dtos/webhook-log-data.dto';
import { WebhookRouterService } from '../services/webhook-router.service';

@ApiTags('Webhook')
@Controller('api')
export class WebhookController {
  constructor(private readonly webhookRouterService: WebhookRouterService) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Receber webhook de eventos' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processado com sucesso',
    schema: {
      type: 'string',
      example: 'Webhook recebido com sucesso (roteamento)',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados do webhook inválidos',
  })
  async handle(@Body() webhookData: WebhookLogDataDTO): Promise<string> {
    await this.webhookRouterService.route(webhookData);
    return 'Webhook recebido com sucesso (roteamento)';
  }
}
