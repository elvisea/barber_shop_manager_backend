import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class MemberServiceCreateResponseDTO {
  @ApiProperty({ example: 'member-service-uuid' })
  id: string;

  @ApiProperty({ example: 'member-uuid' })
  memberId: string;

  @ApiProperty({ example: 'establishment-uuid' })
  establishmentId: string;

  @ApiProperty({ example: 'service-uuid' })
  serviceId: string;

  @ApiProperty({ example: 5000, description: 'Price in cents' })
  price: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission as decimal (e.g., 0.15 = 15%)',
  })
  commission: number;

  @ApiProperty({ example: 120, description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
