import { Matches, ValidationOptions } from 'class-validator';

/**
 * Regex para validação de senha forte
 * Requisitos:
 * - Pelo menos uma letra minúscula
 * - Pelo menos uma letra maiúscula
 * - Pelo menos um número
 * - Pelo menos um caractere especial (!@#$%^&*()_+-=[]{};':"\\|,.<>/?)
 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

/**
 * Mensagem padrão para validação de senha
 */
export const PASSWORD_MESSAGE =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?).';

/**
 * Decorator reutilizável para validação de senha forte
 *
 * @param validationOptions - Opções de validação customizadas (opcional)
 * @returns Decorator @Matches configurado para validação de senha
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @IsPassword()
 *   password: string;
 * }
 * ```
 */
export function IsPassword(validationOptions?: ValidationOptions) {
  return Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE,
    ...validationOptions,
  });
}
