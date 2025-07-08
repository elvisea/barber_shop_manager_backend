import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class EstablishmentMemberCreateResponseDTO {
  @ApiProperty({ example: 'uuid-user' })
  userId: string;

  @ApiProperty({ example: 'uuid-establishment' })
  establishmentId: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-07-03T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-03T12:00:00.000Z' })
  updatedAt: Date;
}
