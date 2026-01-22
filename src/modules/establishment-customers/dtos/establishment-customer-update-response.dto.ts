import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class EstablishmentCustomerUpdateResponseDTO {
  @ApiProperty({ example: 'uuid-cliente' })
  id: string;

  @ApiProperty({ example: 'uuid-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  email?: string | null;

  @ApiPropertyOptional({ example: '+5511999999999' })
  phone?: string | null;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
