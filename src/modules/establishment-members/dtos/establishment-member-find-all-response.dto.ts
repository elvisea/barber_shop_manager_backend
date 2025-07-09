import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentMemberFindAllItemDTO {
  @ApiProperty({ example: 'uuid-user' })
  userId: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@email.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: Role, example: Role.BARBER })
  role: Role;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-07-01T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-01T12:00:00.000Z' })
  updatedAt: Date;
}

export class EstablishmentMemberFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentMemberFindAllItemDTO> {}
