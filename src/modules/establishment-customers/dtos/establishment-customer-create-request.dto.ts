import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EstablishmentCustomerCreateRequestDTO {
  @ApiProperty({ example: 'uuid-estabelecimento' })
  @IsNotEmpty()
  @IsString()
  establishmentId: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '11999999999' })
  @IsOptional()
  @IsString()
  phone?: string;
}
