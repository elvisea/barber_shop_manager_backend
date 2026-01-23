import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { validateCpf } from '../utils/validate-cpf';

/**
 * Validador de CPF para class-validator.
 *
 * Valida se o CPF é válido usando validação completa:
 * - Formato (11 dígitos)
 * - Dígitos verificadores
 * - CPFs inválidos conhecidos
 */
@ValidatorConstraint({ name: 'isValidCpf', async: false })
export class IsValidCpfConstraint implements ValidatorConstraintInterface {
  validate(cpf: string): boolean {
    if (!cpf || typeof cpf !== 'string') {
      return false;
    }
    return validateCpf(cpf);
  }

  defaultMessage(): string {
    return 'CPF must be a valid Brazilian CPF (11 digits with valid check digits)';
  }
}

/**
 * Decorator para validação de CPF brasileiro.
 *
 * Valida se o CPF é válido usando validação completa:
 * - Remove formatação automaticamente
 * - Verifica tamanho (11 dígitos)
 * - Verifica dígitos verificadores
 * - Rejeita CPFs inválidos conhecidos (todos os dígitos iguais)
 *
 * @param validationOptions - Opções de validação customizadas (opcional)
 * @returns Decorator para validação de CPF
 *
 * @example
 * ```typescript
 * class CreateUserDto {
 *   @IsValidCpf()
 *   document: string; // Aceita '123.456.789-09' ou '12345678909'
 * }
 * ```
 */
export function IsValidCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCpfConstraint,
    });
  };
}
