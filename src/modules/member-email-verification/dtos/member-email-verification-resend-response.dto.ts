import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate, getFutureDateTime } from '@/common/utils/date-helpers';

export class MemberEmailVerificationResendResponseDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID da verificação de email',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID do membro',
  })
  memberId: string;

  @ApiProperty({
    example: 'membro@email.com',
    description: 'Email do membro',
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Status de verificação',
  })
  verified: boolean;

  @ApiProperty({
    example: getFutureDateTime(1, 10, 0),
    description: 'Data de expiração do token',
  })
  expiresAt: Date;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'Data de atualização',
  })
  updatedAt: Date;
}
