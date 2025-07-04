import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EstablishmentProductUpdateRequestDTO {
  @ApiPropertyOptional({ example: 'Cera Modeladora Efeito Matte' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Alta fixação e sem brilho.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 4500, description: 'Preço em centavos' })
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

  @ApiPropertyOptional({ example: 50, description: 'Estoque' })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}
