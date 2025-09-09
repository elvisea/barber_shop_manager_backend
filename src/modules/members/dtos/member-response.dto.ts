import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '@prisma/client';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class MemberResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  establishmentId?: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ enum: MemberRole, example: MemberRole.BARBER })
  role: MemberRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}

export class MemberPaginatedResponseDTO extends BasePaginatedResponseDTO<MemberResponseDTO> {
  @ApiProperty({ type: [MemberResponseDTO] })
  declare data: MemberResponseDTO[];
}
