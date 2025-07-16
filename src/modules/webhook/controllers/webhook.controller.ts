import { Body, Controller, Post } from '@nestjs/common';

import { WebhookRouterService } from '../services/webhook-router.service';

@Controller('api')
export class WebhookController {
  constructor(private readonly webhookRouterService: WebhookRouterService) {}

  @Post('webhook')
  async handle(@Body() body: any): Promise<string> {
    await this.webhookRouterService.route(body);
    return 'Webhook recebido com sucesso (roteamento)';
  }
}
