import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class MemberServiceCreateRequestDTO {
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

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @IsNumber()
  @Min(0)
  duration: number;
}
