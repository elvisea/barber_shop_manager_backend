import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

import { getEndDate, getPastDate } from '@/common/utils/date-helpers';

export class SubscriptionCreateRequestDTO {
  @ApiProperty({ example: 'uuid-do-estabelecimento' })
  @IsString()
  @IsNotEmpty()
  establishmentId: string;

  @ApiProperty({ example: 'uuid-do-plano' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return start;
    })(),
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return getEndDate(start, 30);
    })(),
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  paid?: boolean = false;

  @ApiProperty({
    example: '+5511999999999',
    description: 'Phone number in E.164 format',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
}
