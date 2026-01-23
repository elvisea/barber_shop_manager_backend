/**
 * Removes formatting from CPF string (dots, dashes, spaces).
 *
 * @param cpf - The CPF string to clean.
 * @returns The cleaned CPF string with only digits.
 *
 * @example
 * ```typescript
 * cleanCpf('123.456.789-00') // Returns: '12345678900'
 * cleanCpf('123 456 789 00') // Returns: '12345678900'
 * ```
 */
export function cleanCpf(cpf: string): string {
  if (!cpf) return '';
  return cpf.replace(/[^\d]/g, '');
}
