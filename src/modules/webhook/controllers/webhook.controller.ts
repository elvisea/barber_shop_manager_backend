import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { WebhookDocs } from '../docs/webhook.docs';
import { WebhookLogDataDTO } from '../dtos/webhook-log-data.dto';
import { WebhookRouterService } from '../services/webhook-router.service';

@ApiTags('Webhook')
@Controller('api')
export class WebhookController {
  constructor(private readonly webhookRouterService: WebhookRouterService) {}

  @Post('webhook')
  @WebhookDocs()
  async handle(@Body() webhookData: WebhookLogDataDTO): Promise<string> {
    await this.webhookRouterService.route(webhookData);
    return 'Webhook recebido com sucesso (roteamento)';
  }
}
