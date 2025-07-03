import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDTO {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'Email do usuário (será convertido para lowercase)'
  })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: '123456789',
    description: 'Senha do usuário (mínimo 6 caracteres)'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do usuário'
  })
  @IsPhoneNumber('BR')
  phone: string;
} 