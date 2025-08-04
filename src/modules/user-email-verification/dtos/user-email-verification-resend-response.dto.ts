import { ApiProperty } from '@nestjs/swagger';

export class UserEmailVerificationResendResponseDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da verificação de email',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do usuário',
  })
  userId: string;

  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Status de verificação',
  })
  verified: boolean;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de expiração do token',
  })
  expiresAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de atualização',
  })
  updatedAt: Date;
}
