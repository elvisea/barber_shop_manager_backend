import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionCreateResponseDTO {
  @ApiProperty({ example: 'uuid-da-assinatura' })
  id: string;

  @ApiProperty({ example: 'uuid-do-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'uuid-do-plano' })
  planId: string;

  @ApiProperty({ example: '2024-07-20T00:00:00Z' })
  startDate: string;

  @ApiProperty({ example: '2024-08-20T00:00:00Z' })
  endDate: string;

  @ApiProperty({ example: true })
  paid: boolean;

  @ApiProperty({ example: '5511999999999' })
  phone: string;

  @ApiProperty({ example: '2024-07-20T00:00:00Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-07-20T00:00:00Z' })
  updatedAt: string;
}
