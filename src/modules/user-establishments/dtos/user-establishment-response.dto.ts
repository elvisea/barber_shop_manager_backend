import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class EstablishmentInfoDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Barbearia do João' })
  name: string;

  @ApiProperty({ example: 'Rua das Flores, 123' })
  address: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;
}

export class UserEstablishmentResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  establishmentId: string;

  @ApiProperty({ type: EstablishmentInfoDTO, required: false })
  establishment?: EstablishmentInfoDTO;

  @ApiProperty({ enum: UserRole, example: UserRole.BARBER })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
