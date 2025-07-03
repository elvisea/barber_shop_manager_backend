import { ErrorCode } from '@/enums/error-code';
import { messages } from './messages';

export class ErrorMessageService {
  private readonly messages = messages;

  getMessage(
    errorCode: ErrorCode,
    params?: Record<string, string | number>,
  ): string {
    const errorMessage = this.messages[errorCode];

    if (!errorMessage) {
      throw new Error(`Error message not found for error code: ${errorCode}`);
    }

    let message = errorMessage.message;

    // Só faz a substituição se houver parâmetros
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        message = message.replace(`[${key}]`, String(value));
      }
    }

    return message;
  }
}
