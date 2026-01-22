import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate, getFutureDateTime } from '@/common/utils/date-helpers';

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
    example: getFutureDateTime(1, 10, 0),
    description: 'Data de expiração do token',
  })
  expiresAt: Date;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'Data de criação da verificação',
  })
  createdAt: Date;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}
