/**
 * Extrai a mensagem de erro de um valor unknown de forma segura.
 *
 * @param error - Erro do tipo unknown
 * @returns Mensagem de erro como string
 */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Extrai o stack trace de um erro de forma segura.
 *
 * @param error - Erro do tipo unknown
 * @returns Stack trace como string ou undefined se não disponível
 */
export function getErrorStack(error: unknown): string | undefined {
  return error instanceof Error ? error.stack : undefined;
}
