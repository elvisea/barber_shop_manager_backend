import { ApiProperty } from '@nestjs/swagger';

export class ValidatePasswordResetTokenResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se o token é válido',
  })
  valid: boolean;

  @ApiProperty({
    example: 'Token válido. Você pode prosseguir com a redefinição de senha.',
    description: 'Mensagem de resposta',
  })
  message: string;
}
