import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SubscriptionUpdateRequestDTO {
  @ApiProperty({ example: 'uuid-do-plano', required: false })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiProperty({ example: '2024-07-20T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2024-08-20T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  paid?: boolean;

  @ApiProperty({ example: '5511999999999', required: false })
  @IsString()
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;
}
