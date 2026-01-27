import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class MemberServiceUpdateRequestDTO {
  @ApiProperty({
    example: 5000,
    description: 'Price in cents',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission as decimal (e.g., 0.15 = 15%)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;

  @ApiProperty({
    example: 30,
    description: 'Duration in minutes',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;
}
