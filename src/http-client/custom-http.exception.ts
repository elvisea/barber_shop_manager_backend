/**
 * CustomHttpException
 *
 * Exceção personalizada para erros HTTP originados de requisições Axios.
 * Fornece detalhes adicionais sobre a falha, como URL, método, status e sugestão.
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export class CustomHttpException extends HttpException {
  /**
   * Cria uma nova CustomHttpException.
   * @param error Erro original do Axios
   * @param method Método HTTP da requisição
   * @param url URL da requisição
   */
  constructor(error: AxiosError, method: string | undefined, url: string) {
    const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = `Error during ${method} request to ${url}`;

    super(
      {
        message,
        errorCode: 'HTTP_CLIENT_ERROR',
        details: {
          url,
          method,
          status,
          data: error.response?.data || 'No response data',
          suggestion:
            'Verify the API endpoint or check the request configuration',
        },
      },
      status,
    );
  }
}
