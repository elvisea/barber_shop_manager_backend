import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { getEndDate, getPastDate } from '@/common/utils/date-helpers';

export class SubscriptionUpdateRequestDTO {
  @ApiProperty({ example: 'uuid-do-plano', required: false })
  @IsString()
  @IsOptional()
  planId?: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return start;
    })(),
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return getEndDate(start, 30);
    })(),
    required: false,
  })
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
