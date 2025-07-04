import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EstablishmentServiceCreateRequestDTO {
  @ApiProperty({ example: 'Corte Masculino' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Corte tradicional masculino com acabamento',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 30, description: 'Duração em minutos' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 5000, description: 'Preço em centavos' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 0.15,
    description: 'Comissão em decimal (ex: 0.15 = 15%)',
  })
  @IsNumber()
  @Min(0)
  commission: number;
}
