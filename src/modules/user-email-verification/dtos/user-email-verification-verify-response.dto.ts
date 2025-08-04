import { ApiProperty } from '@nestjs/swagger';

export class UserEmailVerificationVerifyResponseDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da verificação de email',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do usuário',
  })
  userId: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o email foi verificado',
  })
  verified: boolean;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de expiração do token',
  })
  expiresAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de criação da verificação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}
