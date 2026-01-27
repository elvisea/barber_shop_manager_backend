import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class MemberResendVerificationRequestDto {
  @ApiProperty({
    example: 'membro@example.com',
    description: 'Email do membro para reenviar o código de verificação',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;
}
