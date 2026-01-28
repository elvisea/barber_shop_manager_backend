/**
 * Geração de telefones brasileiros no formato E.164 para seeds.
 * Formato: +55 + DDD (2 dígitos) + 9 + 8 dígitos (ex: +5511987654321)
 */

const BRAZIL_PREFIX = '+55';
const MIN_DDD = 11;
const MAX_DDD = 99;

/**
 * Gera um telefone brasileiro em E.164 único.
 * Aceita um Set de telefones já usados e retorna um novo número até encontrar um livre.
 *
 * @param usedPhones Set de telefones já utilizados (será mutado, adicionando o novo)
 * @returns Telefone no formato E.164 (ex: +5511999990001)
 */
export function generateE164BrazilianPhone(usedPhones: Set<string>): string {
  let phone: string;
  do {
    const ddd = Math.floor(Math.random() * (MAX_DDD - MIN_DDD + 1)) + MIN_DDD;
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0');
    phone = `${BRAZIL_PREFIX}${ddd}9${firstDigit}${remainingDigits}`;
  } while (usedPhones.has(phone));

  usedPhones.add(phone);
  return phone;
}

/**
 * Gera um telefone E.164 determinístico a partir de um contador.
 * Útil para seeds onde se quer evitar aleatoriedade e garantir unicidade.
 * Formato: +55 + 11 (DDD) + 9 dígitos do contador = 11 dígitos após +55.
 *
 * @param counter Valor único (ex: 1, 2, 3...) - será usado nos últimos dígitos
 * @returns Telefone no formato E.164 (ex: +5511000000001)
 */
export function generateE164FromCounter(counter: number): string {
  const padded = counter.toString().padStart(9, '0').slice(-9);
  return `${BRAZIL_PREFIX}11${padded}`;
}
