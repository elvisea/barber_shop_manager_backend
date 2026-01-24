import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

import { IsPassword } from '@/common/validators/password.validator';

export class ResetPasswordRequestDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    example: '123456',
    description:
      'Token de redefinição de senha recebido por email (6 dígitos numéricos)',
  })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  @IsString({ message: 'Token deve ser uma string' })
  @Length(6, 6, {
    message: 'O token de redefinição deve ter exatamente 6 dígitos',
  })
  @Matches(/^\d+$/, {
    message: 'O token de redefinição deve conter apenas números',
  })
  token: string;

  @ApiProperty({
    example: 'NovaSenh@123',
    description:
      'Nova senha (mínimo 8 caracteres, deve conter maiúscula, minúscula, número e caractere especial)',
  })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsPassword()
  newPassword: string;

  @ApiProperty({
    example: 'NovaSenh@123',
    description: 'Confirmação da nova senha (deve ser igual à nova senha)',
  })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @IsString({ message: 'Confirmação de senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsPassword()
  confirmPassword: string;
}
