import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EstablishmentServiceUpdateRequestDTO {
  @ApiPropertyOptional({ example: 'Corte Masculino' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Corte de cabelo masculino com tesoura e máquina.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 30, description: 'Duração em minutos' })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiPropertyOptional({ example: 5000, description: 'Preço em centavos' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    example: 0.1,
    description: 'Comissão (decimal, ex: 0.1 = 10%)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  commission?: number;
}
