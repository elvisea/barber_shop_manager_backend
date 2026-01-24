import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetRequestDto {
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Email do usuário para redefinição de senha',
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ser um endereço válido' })
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email: string;
}
