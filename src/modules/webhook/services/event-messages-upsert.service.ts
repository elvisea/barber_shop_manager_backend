import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MessagesUpsertLog } from '../interfaces';

import { HttpClientService } from '@/http-client/http-client.service';

@Injectable()
export class EventMessagesUpsertService {
  private readonly logger = new Logger(EventMessagesUpsertService.name);

  constructor(
    private readonly httpClient: HttpClientService,
    private readonly configService: ConfigService,
  ) { }

  async handle(payload: MessagesUpsertLog): Promise<void> {
    this.logger.log(
      '[EventMessagesUpsertService] --- INÍCIO DO PROCESSAMENTO ---',
    );

    this.logger.debug(
      '[EventMessagesUpsertService] Payload recebido:',
      JSON.stringify(payload, null, 2),
    );

    const { data, instance, apikey } = payload;

    const number = data.key.remoteJid.replace(/[^0-9]/g, '');
    this.logger.log(`[EventMessagesUpsertService] Número extraído: ${number}`);

    const text = `Mensagem recebida às ${new Date().toLocaleTimeString()} - ${data.message.conversation}`;
    this.logger.log(`[EventMessagesUpsertService] Texto de resposta: ${text}`);

    const apiUrl =
      this.configService.get<string>('EVOLUTION_API_URL') ||
      'http://api:8080';
    const url = `${apiUrl}/message/sendText/${instance}`;
    this.logger.log(`[EventMessagesUpsertService] URL de envio: ${url}`);

    this.logger.log(
      `[EventMessagesUpsertService] API Key utilizada: ${apikey}`,
    );

    const response = await this.httpClient.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey,
      },
      data: {
        number,
        text,
      },
    });

    this.logger.log(
      `[EventMessagesUpsertService] Resposta recebida da API: ${JSON.stringify(response, null, 2)}`,
    );
    this.logger.log(
      `[EventMessagesUpsertService] Mensagem de resposta enviada para ${number}`,
    );
    this.logger.log(
      '[EventMessagesUpsertService] --- FIM DO PROCESSAMENTO ---',
    );
  }
}
