import { ApiProperty } from '@nestjs/swagger';

export class MemberProductCreateResponseDTO {
  @ApiProperty({ example: 'member-product-uuid' })
  id: string;

  @ApiProperty({ example: 'member-uuid' })
  memberId: string;

  @ApiProperty({ example: 'establishment-uuid' })
  establishmentId: string;

  @ApiProperty({ example: 'product-uuid' })
  productId: string;

  @ApiProperty({ example: 5000, description: 'Price in cents' })
  price: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission as decimal (e.g., 0.15 = 15%)',
  })
  commission: number;

  @ApiProperty({ example: '2024-07-03T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-03T10:00:00Z' })
  updatedAt: Date;
}
