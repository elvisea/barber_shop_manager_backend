import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class MemberVerifyEmailRequestDto {
  @ApiProperty({
    example: 'membro@example.com',
    description: 'Email do membro que está verificando',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({
    example: '123456',
    description:
      'Código de verificação enviado por email (6 dígitos numéricos)',
  })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, {
    message: 'O código de verificação deve ter exatamente 6 dígitos',
  })
  @Matches(/^\d+$/, {
    message: 'O código de verificação deve conter apenas números',
  })
  token: string;
}
