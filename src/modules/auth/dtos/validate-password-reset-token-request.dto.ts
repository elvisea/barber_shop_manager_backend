import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ValidatePasswordResetTokenRequestDto {
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
}
