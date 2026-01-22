import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class EstablishmentCustomerCreateResponseDTO {
  @ApiProperty({ example: 'uuid-cliente' })
  id: string;

  @ApiProperty({ example: 'uuid-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  phone?: string;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
