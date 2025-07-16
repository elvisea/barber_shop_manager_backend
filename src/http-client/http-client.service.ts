/**
 * HttpClientService
 *
 * Serviço responsável por realizar requisições HTTP usando Axios via HttpService do NestJS.
 * Centraliza o tratamento de erros e logging para chamadas HTTP externas.
 */
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { CustomHttpException } from './custom-http.exception';

@Injectable()
export class HttpClientService {
  private readonly logger = new Logger(HttpClientService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Executa uma requisição HTTP genérica.
   * @param url URL de destino
   * @param config Configuração AxiosRequestConfig (método, headers, body, etc)
   * @returns O corpo da resposta (data)
   * @throws CustomHttpException em caso de erro HTTP
   */
  async request<T>(url: string, config: AxiosRequestConfig): Promise<T> {
    this.logger.log(`Executing ${config.method} request to ${url}`);
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .request<T>({
            url,
            ...config,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.handleError(error, url);
              throw new CustomHttpException(error, config.method, url);
            }),
          ),
      );
      return data;
    } catch (error) {
      this.logger.error(`Failed to execute ${config.method} request to ${url}`);
      throw error;
    }
  }

  /**
   * Loga detalhes do erro HTTP recebido.
   * @param error Erro Axios
   * @param url URL de destino
   */
  private handleError(error: AxiosError, url: string): void {
    if (error.response) {
      this.logger.error(
        `Error ${error.response.status} for ${url}: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    } else {
      this.logger.error(`Error for ${url}: ${error.message}`);
    }
  }
}
