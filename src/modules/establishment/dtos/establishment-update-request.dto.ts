import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class EstablishmentUpdateRequestDTO {
  @ApiPropertyOptional({
    description: 'Name of the establishment',
    example: "João's Barbershop",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({
    description: 'Full address of the establishment',
    example: '123 Main St, Downtown, São Paulo - SP',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  address?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the establishment in E.164 format',
    example: '+5511999999999',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;
}
