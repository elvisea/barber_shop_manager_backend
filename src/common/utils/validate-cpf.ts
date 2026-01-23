/**
 * Lista de CPFs inválidos conhecidos (todos os dígitos iguais)
 */
const INVALID_CPFS = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
];

/**
 * Calcula o dígito verificador do CPF.
 *
 * @param cpf - CPF sem os dígitos verificadores (9 primeiros dígitos)
 * @param position - Posição do dígito verificador (10 ou 11)
 * @returns O dígito verificador calculado
 */
function calculateDigit(cpf: string, position: number): number {
  let sum = 0;
  const weight = position === 10 ? 10 : 11;

  for (let i = 0; i < position - 1; i++) {
    sum += parseInt(cpf[i]) * (weight - i);
  }

  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/**
 * Valida um CPF brasileiro.
 *
 * A validação inclui:
 * - Remoção de formatação (pontos e traços)
 * - Verificação de tamanho (11 dígitos)
 * - Verificação de CPFs inválidos conhecidos (todos os dígitos iguais)
 * - Cálculo e verificação dos dígitos verificadores
 *
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se o CPF for válido, false caso contrário
 *
 * @example
 * ```typescript
 * validateCpf('123.456.789-09'); // true
 * validateCpf('12345678909'); // true
 * validateCpf('11111111111'); // false (CPF inválido conhecido)
 * validateCpf('12345678900'); // false (dígitos verificadores inválidos)
 * ```
 */
export function validateCpf(cpf: string): boolean {
  if (!cpf || typeof cpf !== 'string') {
    return false;
  }

  // Remove formatação (pontos, traços e espaços)
  const cleanCpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem exatamente 11 dígitos
  if (cleanCpf.length !== 11) {
    return false;
  }

  // Verifica se é um CPF inválido conhecido (todos os dígitos iguais)
  if (INVALID_CPFS.includes(cleanCpf)) {
    return false;
  }

  // Calcula e verifica o primeiro dígito verificador
  const firstDigit = calculateDigit(cleanCpf, 10);
  if (firstDigit !== parseInt(cleanCpf[9])) {
    return false;
  }

  // Calcula e verifica o segundo dígito verificador
  const secondDigit = calculateDigit(cleanCpf, 11);
  if (secondDigit !== parseInt(cleanCpf[10])) {
    return false;
  }

  return true;
}
