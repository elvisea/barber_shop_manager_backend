import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class EstablishmentCreateRequestDTO {
  @ApiProperty({
    description: 'Full address of the establishment',
    example: '123 Main St, Downtown, São Paulo - SP',
    required: true,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  address: string;

  @ApiProperty({
    description: 'Name of the establishment',
    example: "João's Barbershop",
    required: true,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Phone number of the establishment in E.164 format',
    example: '+5511999999999',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
