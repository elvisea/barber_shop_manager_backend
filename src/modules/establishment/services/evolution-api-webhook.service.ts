import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpClientService } from '@/http-client/http-client.service';

export interface WebhookPayload {
  webhook: {
    enabled: boolean;
    url: string;
    headers: {
      authorization: string;
      'Content-Type': string;
    };
    byEvents: boolean;
    base64: boolean;
    events: string[];
  };
}

@Injectable()
export class EvolutionApiWebhookService {
  private readonly logger = new Logger(EvolutionApiWebhookService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,
  ) {}

  /**
   * Configura webhook para uma instância específica com valores padrão
   */
  async configureWebhook(instanceName: string): Promise<void> {
    this.logger.log(
      `🔧 [WEBHOOK] Configurando webhook para instância: ${instanceName}`,
    );

    const evolutionApiUrl = this.configService.get<string>(
      'EVOLUTION_API_URL',
      'http://api:8080',
    );
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');

    if (!evolutionApiKey) {
      this.logger.error('❌ [WEBHOOK] EVOLUTION_API_KEY não configurada');
      throw new Error('EVOLUTION_API_KEY não configurada');
    }

    // URL do webhook da nossa API
    const webhookUrl = this.configService.get<string>(
      'WEBHOOK_URL',
      'http://barber_shop_manager_backend_app_dev:3333/api/webhook',
    );

    const webhookPayload: WebhookPayload = {
      webhook: {
        enabled: true,
        url: webhookUrl,
        headers: {
          authorization: `Bearer ${evolutionApiKey}`,
          'Content-Type': 'application/json',
        },
        byEvents: false,
        base64: false,
        events: this.getDefaultEvents(),
      },
    };

    this.logger.log(
      `📤 [WEBHOOK] Enviando configuração para: ${evolutionApiUrl}/webhook/set/${instanceName}`,
    );
    this.logger.log(
      `📤 [WEBHOOK] URL do webhook: ${webhookPayload.webhook.url}`,
    );

    try {
      await this.httpClientService.request(
        `${evolutionApiUrl}/webhook/set/${instanceName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: evolutionApiKey,
          },
          data: webhookPayload,
        },
      );

      this.logger.log(
        `✅ [WEBHOOK] Webhook configurado com sucesso para instância: ${instanceName}`,
      );
    } catch (webhookError: any) {
      this.logger.error(
        `❌ [WEBHOOK] Erro ao configurar webhook: ${webhookError.message}`,
      );

      // Não falhar a operação principal se o webhook falhar
      // A instância foi criada com sucesso, apenas o webhook não foi configurado
      this.logger.warn(
        '⚠️ [WEBHOOK] Instância criada, mas webhook não foi configurado. Configure manualmente se necessário.',
      );

      // Re-throw para que o caller possa decidir como tratar
      throw webhookError;
    }
  }

  /**
   * Retorna a lista padrão de eventos para webhook
   */
  private getDefaultEvents(): string[] {
    return ['MESSAGES_UPSERT'];
  }

  /**
   * Desabilita webhook para uma instância
   */
  async disableWebhook(instanceName: string): Promise<void> {
    this.logger.log(
      `🔧 [WEBHOOK] Desabilitando webhook para instância: ${instanceName}`,
    );

    const evolutionApiUrl = this.configService.get<string>(
      'EVOLUTION_API_URL',
      'http://api:8080',
    );
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');

    if (!evolutionApiKey) {
      this.logger.error('❌ [WEBHOOK] EVOLUTION_API_KEY não configurada');
      throw new Error('EVOLUTION_API_KEY não configurada');
    }

    const webhookPayload: WebhookPayload = {
      webhook: {
        enabled: false,
        url: '',
        headers: {
          authorization: `Bearer ${evolutionApiKey}`,
          'Content-Type': 'application/json',
        },
        byEvents: false,
        base64: false,
        events: [],
      },
    };

    try {
      await this.httpClientService.request(
        `${evolutionApiUrl}/webhook/set/${instanceName}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: evolutionApiKey,
          },
          data: webhookPayload,
        },
      );

      this.logger.log(
        `✅ [WEBHOOK] Webhook desabilitado com sucesso para instância: ${instanceName}`,
      );
    } catch (webhookError: any) {
      this.logger.error(
        `❌ [WEBHOOK] Erro ao desabilitar webhook: ${webhookError.message}`,
      );
      throw webhookError;
    }
  }

  /**
   * Busca configuração atual do webhook
   */
  async getWebhookConfig(instanceName: string): Promise<any> {
    this.logger.log(
      `🔍 [WEBHOOK] Buscando configuração do webhook para instância: ${instanceName}`,
    );

    const evolutionApiUrl = this.configService.get<string>(
      'EVOLUTION_API_URL',
      'http://api:8080',
    );
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');

    if (!evolutionApiKey) {
      this.logger.error('❌ [WEBHOOK] EVOLUTION_API_KEY não configurada');
      throw new Error('EVOLUTION_API_KEY não configurada');
    }

    try {
      const response = await this.httpClientService.request(
        `${evolutionApiUrl}/webhook/find/${instanceName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            apikey: evolutionApiKey,
          },
        },
      );

      this.logger.log(
        `✅ [WEBHOOK] Configuração do webhook encontrada para instância: ${instanceName}`,
      );

      return response;
    } catch (webhookError: any) {
      this.logger.error(
        `❌ [WEBHOOK] Erro ao buscar configuração do webhook: ${webhookError.message}`,
      );
      throw webhookError;
    }
  }
}
