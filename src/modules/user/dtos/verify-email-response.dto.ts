import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se a verificação foi bem-sucedida',
  })
  success: boolean;

  @ApiProperty({
    example: 'Email verificado com sucesso!',
    description: 'Mensagem de resposta',
  })
  message: string;
}
