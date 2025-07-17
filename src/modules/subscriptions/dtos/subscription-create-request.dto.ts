import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class SubscriptionCreateRequestDTO {
  @ApiProperty({ example: 'uuid-do-estabelecimento' })
  @IsString()
  @IsNotEmpty()
  establishmentId: string;

  @ApiProperty({ example: 'uuid-do-plano' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ example: '2024-07-20T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-08-20T00:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  paid?: boolean = false;

  @ApiProperty({ example: '5511999999999' })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;
}
