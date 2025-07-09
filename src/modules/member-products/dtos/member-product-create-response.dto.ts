import { ApiProperty } from '@nestjs/swagger';

export class MemberProductCreateResponseDTO {
  @ApiProperty({ example: 'member-product-uuid' })
  id: string;

  @ApiProperty({ example: 'user-uuid' })
  userId: string;

  @ApiProperty({ example: 'establishment-uuid' })
  establishmentId: string;

  @ApiProperty({ example: 'product-uuid' })
  productId: string;

  @ApiProperty({ example: 5000 })
  price: number;

  @ApiProperty({ example: 0.15 })
  commission: number;

  @ApiProperty({ example: '2024-07-03T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-03T10:00:00Z' })
  updatedAt: Date;
}
