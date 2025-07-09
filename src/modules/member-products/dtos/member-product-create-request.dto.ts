import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class MemberProductCreateRequestDTO {
  @ApiProperty({ example: 'product-uuid', description: 'ID of the product' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 5000, description: 'Price in cents' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission as decimal (e.g., 0.15 = 15%)',
  })
  @IsNumber()
  @Min(0)
  commission: number;
}
