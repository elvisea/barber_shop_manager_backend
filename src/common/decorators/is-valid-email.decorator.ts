import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsValidEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
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

          // More rigorous email regex
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          if (!emailRegex.test(value)) {
            return false;
          }

          // Check for suspicious domains
          const suspiciousDomains = [
            '.com.com',
            '.org.org',
            '.net.net',
            '.co.co',
            '.br.br',
            '.test.test',
            '.example.example',
            '.localhost',
            '.invalid',
          ];

          const lowerValue = value.toLowerCase();
          for (const suspicious of suspiciousDomains) {
            if (lowerValue.includes(suspicious)) {
              return false;
            }
          }

          // Check for consecutive suspicious characters
          if (lowerValue.includes('..') || lowerValue.includes('@@')) {
            return false;
          }

          // Check if starts or ends with special characters
          if (
            lowerValue.startsWith('.') ||
            lowerValue.endsWith('.') ||
            lowerValue.startsWith('-') ||
            lowerValue.endsWith('-')
          ) {
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Email must have a valid format and use a real domain';
        },
      },
    });
  };
}
