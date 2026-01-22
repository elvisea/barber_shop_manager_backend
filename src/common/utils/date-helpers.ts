/**
 * Utilitários para manipulação de datas em exemplos do Swagger
 */

/**
 * Gera uma data no futuro (hoje + dias) em UTC.
 * Usado principalmente para exemplos em documentação e DTOs.
 * Usa métodos UTC para garantir consistência com padrões do projeto.
 *
 * @param days Número de dias a adicionar (padrão: 1)
 * @returns Data em formato ISO string (UTC)
 */
export function getFutureDate(days: number = 1): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

/**
 * Gera uma data no futuro com hora específica em UTC.
 * Usado principalmente para exemplos em documentação e DTOs.
 * Usa métodos UTC para garantir consistência com padrões do projeto.
 *
 * @param days Número de dias a adicionar (padrão: 1)
 * @param hours Hora do dia em UTC (padrão: 0)
 * @param minutes Minutos em UTC (padrão: 0)
 * @returns Data em formato ISO string (UTC)
 */
export function getFutureDateTime(
  days: number = 1,
  hours: number = 0,
  minutes: number = 0,
): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hours, minutes, 0, 0);
  return date.toISOString();
}

/**
 * Gera uma data de fim de período (startDate + dias) em UTC.
 * Usado principalmente para exemplos em documentação e DTOs.
 * Usa métodos UTC para garantir consistência com padrões do projeto.
 *
 * @param startDate Data de início em formato ISO string (UTC)
 * @param days Número de dias a adicionar (padrão: 7)
 * @returns Data em formato ISO string (UTC)
 */
export function getEndDate(startDate: string, days: number = 7): string {
  const date = new Date(startDate);
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(23, 59, 59, 999);
  return date.toISOString();
}

/**
 * Retorna a data/hora atual em formato ISO string (UTC).
 * Usado principalmente para exemplos em documentação e DTOs.
 *
 * @returns Data atual em formato ISO string (UTC)
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}

/**
 * Gera uma data no passado (hoje - dias) em UTC.
 * Usado principalmente para exemplos em documentação e DTOs quando
 * é necessário mostrar múltiplos itens com datas diferentes.
 * Usa métodos UTC para garantir consistência com padrões do projeto.
 *
 * @param days Número de dias a subtrair (padrão: 1)
 * @returns Data em formato ISO string (UTC)
 */
export function getPastDate(days: number = 1): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}
