import { ApiProperty } from '@nestjs/swagger';

import {
  getCurrentDate,
  getEndDate,
  getPastDate,
} from '@/common/utils/date-helpers';

export class SubscriptionCreateResponseDTO {
  @ApiProperty({ example: 'uuid-da-assinatura' })
  id: string;

  @ApiProperty({ example: 'uuid-do-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'uuid-do-plano' })
  planId: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return start;
    })(),
  })
  startDate: string;

  @ApiProperty({
    example: (() => {
      const start = getPastDate(30);
      return getEndDate(start, 30);
    })(),
  })
  endDate: string;

  @ApiProperty({ example: true })
  paid: boolean;

  @ApiProperty({ example: '5511999999999' })
  phone: string;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: string;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: string;
}
