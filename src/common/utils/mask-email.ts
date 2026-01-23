/**
 * Masks email addresses by replacing the username with asterisks.
 *
 * @param email - The email address to mask.
 * @returns The masked email address or empty string if the input is null or undefined.
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return '***@***.***';

  return `${username.substring(0, 2)}***@${domain}`;
}
