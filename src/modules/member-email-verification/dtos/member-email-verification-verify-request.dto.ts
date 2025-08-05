import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MemberEmailVerificationVerifyRequestDTO {
  @ApiProperty({
    example: 'membro@example.com',
    description: 'Email do membro que está verificando',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de verificação enviado por email',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
