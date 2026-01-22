import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qrcode from 'qrcode-terminal';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { getErrorMessage } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { HttpClientService } from '@/http-client/http-client.service';

// Interface para a resposta real da Evolution API
export interface EvolutionApiCreateInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    integration: string;
    webhookWaBusiness: string | null;
    accessTokenWaBusiness: string;
    status: string;
  };
  hash: string;
  webhook: Record<string, any>;
  websocket: Record<string, any>;
  rabbitmq: Record<string, any>;
  nats: Record<string, any>;
  sqs: Record<string, any>;
  settings: {
    rejectCall: boolean;
    msgCall: string;
    groupsIgnore: boolean;
    alwaysOnline: boolean;
    readMessages: boolean;
    readStatus: boolean;
    syncFullHistory: boolean;
    wavoipToken: string;
  };
  qrcode: {
    pairingCode: string | null;
    code: string;
    base64: string;
    count: number;
  };
}

export interface CreateInstanceParams {
  instanceName: string;
  number?: string;
  qrcode?: boolean;
  integration?: 'WHATSAPP-BAILEYS' | 'WHATSAPP-BUSINESS' | 'EVOLUTION';
}

@Injectable()
export class EvolutionApiInstanceService {
  private readonly logger = new Logger(EvolutionApiInstanceService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClientService: HttpClientService,
  ) {}

  /**
   * Cria uma nova instância na Evolution API
   */
  async createInstance(
    params: CreateInstanceParams,
  ): Promise<EvolutionApiCreateInstanceResponse> {
    this.logger.log(
      `🔧 [EVOLUTION-API] Criando instância: ${params.instanceName}`,
    );

    const evolutionApiUrl = this.configService.get<string>(
      'EVOLUTION_API_URL',
      'http://api:8080',
    );
    const evolutionApiKey = this.configService.get<string>('EVOLUTION_API_KEY');

    if (!evolutionApiKey) {
      const message = 'EVOLUTION_API_KEY não configurada';
      this.logger.error(`❌ [EVOLUTION-API] ${message}`);
      throw new CustomHttpException(
        message,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.VALIDATION_ERROR,
      );
    }

    // Preparar payload para a Evolution API
    const payload = {
      instanceName: params.instanceName,
      number: params.number,
      qrcode: params.qrcode ?? true,
      integration: params.integration ?? 'WHATSAPP-BAILEYS',
    };

    this.logger.log(
      `📤 [EVOLUTION-API] Enviando requisição para: ${evolutionApiUrl}/instance/create`,
    );
    this.logger.log(`📤 [EVOLUTION-API] Payload: ${JSON.stringify(payload)}`);

    try {
      const response =
        await this.httpClientService.request<EvolutionApiCreateInstanceResponse>(
          `${evolutionApiUrl}/instance/create`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: evolutionApiKey,
            },
            data: payload,
          },
        );

      this.logger.log(
        `✅ [EVOLUTION-API] Instância criada com sucesso: ${params.instanceName}`,
      );
      this.logger.log(
        `✅ [EVOLUTION-API] ID da instância: ${response.instance.instanceId}`,
      );

      // Imprimir QR Code no terminal se disponível
      this.printQrCode(response);

      return response;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      this.logger.error(
        `❌ [EVOLUTION-API] Erro ao criar instância: ${errorMessage}`,
      );

      // Verificar se é um erro HTTP do axios
      const httpError = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      const apiErrorMessage =
        httpError.response?.data?.message ||
        'Erro ao criar instância na Evolution API';

      throw new CustomHttpException(
        apiErrorMessage,
        httpError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.VALIDATION_ERROR,
      );
    }
  }

  /**
   * Imprime QR Code no terminal
   */
  private printQrCode(response: EvolutionApiCreateInstanceResponse): void {
    if (response.qrcode && response.qrcode.code) {
      this.logger.log(
        '📱 [EVOLUTION-API] QR Code gerado! Escaneie com o WhatsApp:',
      );
      this.logger.log('='.repeat(50));

      try {
        const qrCodeData = response.qrcode.code;

        this.logger.log(
          `📱 [EVOLUTION-API] Gerando QR Code com dados: ${qrCodeData.substring(0, 50)}...`,
        );

        // Tentar imprimir QR Code no terminal usando qrcode-terminal (forma síncrona)
        try {
          qrcode.generate(qrCodeData, { small: true });
          this.logger.log(
            '📱 [EVOLUTION-API] QR Code impresso no terminal acima!',
          );
        } catch (terminalError: unknown) {
          // Se qrcode-terminal falhar, imprimir informações alternativas
          const errorMessage = getErrorMessage(terminalError);
          this.logger.warn(
            `⚠️ [EVOLUTION-API] qrcode-terminal falhou: ${errorMessage}`,
          );
          this.logger.log(
            '📱 [EVOLUTION-API] QR Code não pôde ser impresso no terminal',
          );
          this.logger.log(
            '📱 [EVOLUTION-API] Use o campo qrcode.base64 para exibir em interface web',
          );
        }

        this.logger.log(
          `📱 [EVOLUTION-API] Status da instância: ${response.instance.status}`,
        );
        this.logger.log(
          `📱 [EVOLUTION-API] ID da instância: ${response.instance.instanceId}`,
        );
        this.logger.log('='.repeat(50));
      } catch (qrError: unknown) {
        const errorMessage = getErrorMessage(qrError);
        this.logger.warn(
          `⚠️ [EVOLUTION-API] Erro ao gerar QR Code no terminal: ${errorMessage}`,
        );
        this.logger.log(
          `📱 [EVOLUTION-API] Código QR disponível: ${response.qrcode.code.substring(0, 100)}...`,
        );
      }
    } else {
      this.logger.warn('⚠️ [EVOLUTION-API] QR Code não disponível na resposta');
    }
  }
}
