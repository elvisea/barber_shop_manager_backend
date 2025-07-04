import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class EstablishmentServiceQueryRequestDTO {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number;

  @ApiProperty({ example: 'uuid-do-estabelecimento', required: false })
  @IsOptional()
  @IsString()
  establishmentId?: string;

  @ApiProperty({ example: 'uuid-do-servico', required: false })
  @IsOptional()
  @IsString()
  serviceId?: string;
}
