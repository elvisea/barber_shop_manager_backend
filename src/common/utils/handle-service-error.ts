import { HttpStatus, Logger } from '@nestjs/common';

import { getErrorMessage } from './error-helpers';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { ToolResult } from '@/modules/ai/tools/types/tool-definition.types';

interface HandleServiceErrorParams {
  error: unknown;
  logger: Logger;
  errorMessageService: ErrorMessageService;
  errorCode: ErrorCode;
  httpStatus: HttpStatus;
  logMessage: string;
  logContext?: Record<string, any>;
  errorParams?: Record<string, string | number>;
}

/**
 * Função utilitária para centralizar o tratamento de erros em serviços.
 * Extrai detalhes do erro, faz log com contexto e lança CustomHttpException.
 *
 * @param params - Parâmetros para tratamento do erro
 * @throws {CustomHttpException} - Sempre lança uma exceção customizada
 */
export function handleServiceError(params: HandleServiceErrorParams): never {
  const {
    error,
    logger,
    errorMessageService,
    errorCode,
    httpStatus,
    logMessage,
    logContext = {},
    errorParams = {},
  } = params;

  // Extrair detalhes do erro
  const errorDetails = getErrorMessage(error);

  // Fazer log com contexto
  logger.error(logMessage, {
    ...logContext,
    error: errorDetails,
  });

  // Obter mensagem de erro
  const errorMessage = errorMessageService.getMessage(errorCode, errorParams);

  // Lançar CustomHttpException
  throw new CustomHttpException(errorMessage, httpStatus, errorCode);
}

/**
 * Função utilitária para extrair mensagem de erro formatada sem lançar exceção.
 * Útil para handlers que retornam ToolResult em vez de lançar exceções.
 *
 * @param params - Parâmetros para tratamento do erro
 * @returns Mensagem de erro formatada
 */
export function getErrorMessage(
  params: Omit<HandleServiceErrorParams, 'httpStatus'>,
): string {
  const {
    error,
    logger,
    errorMessageService,
    errorCode,
    logMessage,
    logContext = {},
    errorParams = {},
  } = params;

  // Extrair detalhes do erro
  const errorDetails = getErrorMessage(error);

  // Fazer log com contexto
  logger.error(logMessage, {
    ...logContext,
    error: errorDetails,
  });

  // Obter mensagem de erro
  return errorMessageService.getMessage(errorCode, errorParams);
}

interface HandleToolErrorParams {
  error: unknown;
  logger: Logger;
  errorMessageService: ErrorMessageService;
  handlerName: string;
  logContext?: Record<string, any>;
}

/**
 * Função utilitária para centralizar o tratamento de erros em handlers de tools.
 * Retorna ToolResult padronizado com tratamento específico para CustomHttpException
 * e tratamento genérico para outros erros.
 *
 * @param params - Parâmetros para tratamento do erro
 * @returns ToolResult com success: false e mensagem de erro
 */
export function handleToolError<T = any>(
  params: HandleToolErrorParams,
): ToolResult<T> {
  const {
    error,
    logger,
    errorMessageService,
    handlerName,
    logContext = {},
  } = params;

  // Se for CustomHttpException, usar código e mensagem específicos
  if (error instanceof CustomHttpException) {
    const errorResponse = error.getResponse() as {
      message: string;
      errorCode: ErrorCode;
    };

    logger.error(`❌ [${handlerName}] Erro ao executar operação`, {
      ...logContext,
      errorCode: errorResponse.errorCode,
      message: errorResponse.message,
    });

    return {
      success: false,
      error: errorResponse.message,
    };
  }

  // Para outros erros, usar tratamento genérico
  const errorDetails = getErrorMessage(error);
  logger.error(`❌ [${handlerName}] Erro ao executar operação`, {
    ...logContext,
    error: errorDetails,
  });

  const errorMessage = errorMessageService.getMessage(
    ErrorCode.VALIDATION_ERROR,
    {},
  );

  return {
    success: false,
    error: errorMessage,
  };
}
