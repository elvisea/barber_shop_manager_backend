import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se a solicitação foi processada com sucesso',
  })
  success: boolean;

  @ApiProperty({
    example:
      'Se o email estiver cadastrado, você receberá um código de redefinição de senha.',
    description: 'Mensagem de resposta (sempre genérica por segurança)',
  })
  message: string;
}
