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
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    description: 'User password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '11999999999',
    description: 'User phone number',
  })
  @IsPhoneNumber('BR')
  phone: string;
}
