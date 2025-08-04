import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserEmailVerificationResendRequestDTO {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Email do usuário para reenviar o token de verificação',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
