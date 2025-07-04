import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EstablishmentProductCreateRequestDTO {
  @ApiProperty({ example: 'Cera Modeladora Efeito Matte' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Alta fixação e sem brilho.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 4500, description: 'Preço em centavos' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 0.1,
    description: 'Comissão (decimal, ex: 0.1 = 10%)',
  })
  @IsNumber()
  @Min(0)
  commission: number;

  @ApiProperty({ example: 50, description: 'Estoque inicial' })
  @IsInt()
  @Min(0)
  stock: number;
}
