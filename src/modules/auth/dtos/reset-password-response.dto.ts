import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica se a senha foi redefinida com sucesso',
  })
  success: boolean;

  @ApiProperty({
    example:
      'Senha redefinida com sucesso! Você pode fazer login com sua nova senha.',
    description: 'Mensagem de confirmação',
  })
  message: string;
}
