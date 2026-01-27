import { ApiProperty } from '@nestjs/swagger';

export class MemberResendVerificationResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se o reenvio foi bem-sucedido',
  })
  success: boolean;

  @ApiProperty({
    example: 'Novo código de verificação enviado com sucesso!',
    description: 'Mensagem de resposta',
  })
  message: string;
}
