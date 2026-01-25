import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';

import { EstablishmentEvolutionApiCreateInstanceResponseDTO } from '../dtos/establishment-evolution-api-create-instance-response.dto';

import { EvolutionApiInstanceService } from './evolution-api-instance.service';
import { EvolutionApiWebhookService } from './evolution-api-webhook.service';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class EstablishmentEvolutionApiCreateInstanceService {
  private readonly logger = new Logger(
    EstablishmentEvolutionApiCreateInstanceService.name,
  );

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly evolutionApiInstanceService: EvolutionApiInstanceService,
    private readonly evolutionApiWebhookService: EvolutionApiWebhookService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    ownerId: string,
  ): Promise<EstablishmentEvolutionApiCreateInstanceResponseDTO> {
    this.logger.log(
      `🔧 [ESTABLISHMENT-EVOLUTION-API] Iniciando criação de instância para estabelecimento: ${establishmentId}`,
    );

    // ETAPA 1: Validar acesso
    const establishment =
      await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    if (establishment.ownerId !== ownerId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: ownerId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

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
    } catch (webhookError: unknown) {
      const errorMessage =
        webhookError instanceof Error
          ? webhookError.message
          : String(webhookError);
      this.logger.warn(
        `⚠️ [ESTABLISHMENT-EVOLUTION-API] Instância criada, mas webhook não foi configurado: ${errorMessage}`,
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
