import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MemberEmailVerificationResendRequestDTO {
  @ApiProperty({
    example: 'membro@email.com',
    description: 'Email do membro para reenviar o token de verificação',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
