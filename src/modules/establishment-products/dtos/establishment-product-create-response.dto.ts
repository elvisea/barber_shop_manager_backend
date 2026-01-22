import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class EstablishmentProductCreateResponseDTO {
  @ApiProperty({ example: 'uuid-produto' })
  id: string;

  @ApiProperty({ example: 'uuid-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'Cera Modeladora Efeito Matte' })
  name: string;

  @ApiPropertyOptional({ example: 'Alta fixação e sem brilho.' })
  description?: string;

  @ApiProperty({ example: 4500 })
  price: number;

  @ApiProperty({ example: 0.1 })
  commission: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
