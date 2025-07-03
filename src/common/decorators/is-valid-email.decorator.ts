import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          // Regex mais rigorosa para email
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          if (!emailRegex.test(value)) {
            return false;
          }

          // Verificar se não tem domínios suspeitos
          const suspiciousDomains = [
            '.com.com',
            '.org.org',
            '.net.net',
            '.co.co',
            '.br.br',
            '.test.test',
            '.example.example',
            '.localhost',
            '.invalid'
          ];

          const lowerValue = value.toLowerCase();
          for (const suspicious of suspiciousDomains) {
            if (lowerValue.includes(suspicious)) {
              return false;
            }
          }

          // Verificar se não tem caracteres consecutivos suspeitos
          if (lowerValue.includes('..') || lowerValue.includes('@@')) {
            return false;
          }

          // Verificar se não começa ou termina com caracteres especiais
          if (lowerValue.startsWith('.') || lowerValue.endsWith('.') ||
            lowerValue.startsWith('-') || lowerValue.endsWith('-')) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Email deve ter um formato válido e usar um domínio real';
        },
      },
    });
  };
} 