/**
 * Generates a random code of a given length.
 *
 * @param length - The length of the code to generate.
 * @returns The generated code.
 */
export function generateRandomCode(length: number): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}
