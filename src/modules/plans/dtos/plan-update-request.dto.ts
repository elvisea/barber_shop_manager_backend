import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PlanUpdateRequestDTO {
  @ApiProperty({ example: 'Atendimento A.I.', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example:
      'Plano para uso do serviço de atendimento com inteligência artificial',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1999, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 30, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
