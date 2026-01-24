import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

import { IsValidEmail } from '@/common/decorators/is-valid-email.decorator';
import { IsValidCpf } from '@/common/validators/cpf.validator';
import { IsPassword } from '@/common/validators/password.validator';

export class CreateUserRequestDTO {
  @ApiProperty({
    example: 'John Silva',
    description: 'User full name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'admin@bytefulcode.tech',
    description: 'User email (will be converted to lowercase)',
  })
  @IsEmail({}, { message: 'Email must have a valid format' })
  @IsValidEmail({
    message: 'Email must have a valid format and use a real domain',
  })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    description:
      'User password (minimum 8 characters, must contain uppercase, lowercase, number and special character)',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsPassword()
  password: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'User phone number in E.164 format',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '12345678909',
    description:
      'User CPF (Brazilian tax ID) - accepts formatted or unformatted',
  })
  @IsString()
  @IsNotEmpty({ message: 'CPF is required' })
  @IsValidCpf()
  document: string;
}
