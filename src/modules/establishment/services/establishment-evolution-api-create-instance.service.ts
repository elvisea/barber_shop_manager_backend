import { Injectable, Logger } from '@nestjs/common';

import { EstablishmentEvolutionApiCreateInstanceResponseDTO } from '../dtos/establishment-evolution-api-create-instance-response.dto';

import { EvolutionApiInstanceService } from './evolution-api-instance.service';
import { EvolutionApiWebhookService } from './evolution-api-webhook.service';

import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';

@Injectable()
export class EstablishmentEvolutionApiCreateInstanceService {
  private readonly logger = new Logger(
    EstablishmentEvolutionApiCreateInstanceService.name,
  );

  constructor(
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
    private readonly evolutionApiInstanceService: EvolutionApiInstanceService,
    private readonly evolutionApiWebhookService: EvolutionApiWebhookService,
  ) {}

  async execute(
    establishmentId: string,
    ownerId: string,
  ): Promise<EstablishmentEvolutionApiCreateInstanceResponseDTO> {
    this.logger.log(
      `🔧 [ESTABLISHMENT-EVOLUTION-API] Iniciando criação de instância para estabelecimento: ${establishmentId}`,
    );

    // ETAPA 1: Validar acesso usando EstablishmentOwnerAccessService
    const establishment =
      await this.establishmentOwnerAccessService.assertOwnerHasAccess(
        establishmentId,
        ownerId,
      );

    this.logger.log(
      `✅ [ESTABLISHMENT-EVOLUTION-API] Estabelecimento encontrado: ${establishment.name}`,
    );

    // ETAPA 2: Criar instância na Evolution API
    const instanceName = `establishment_${establishment.id}`;

    const instanceResponse =
      await this.evolutionApiInstanceService.createInstance({
        instanceName,
        // number: establishment.phone || undefined,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      });

    this.logger.log(
      `✅ [ESTABLISHMENT-EVOLUTION-API] Instância criada com sucesso: ${instanceName}`,
    );

    // ETAPA 3: Configurar webhook para a instância
    try {
      await this.evolutionApiWebhookService.configureWebhook(
        instanceResponse.instance.instanceName,
      );

      this.logger.log(
        `✅ [ESTABLISHMENT-EVOLUTION-API] Webhook configurado com sucesso para instância: ${instanceResponse.instance.instanceName}`,
      );
    } catch (webhookError) {
      this.logger.warn(
        `⚠️ [ESTABLISHMENT-EVOLUTION-API] Instância criada, mas webhook não foi configurado: ${webhookError.message}`,
      );
      // Não falhar a operação principal se o webhook falhar
      // A instância foi criada com sucesso, apenas o webhook não foi configurado
    }

    this.logger.log(
      `✅ [ESTABLISHMENT-EVOLUTION-API] Processo concluído com sucesso para estabelecimento: ${establishment.name}`,
    );

    // Retornar resposta completa da Evolution API
    return instanceResponse;
  }
}
