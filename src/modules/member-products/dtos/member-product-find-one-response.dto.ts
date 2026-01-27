import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class MemberProductFindOneResponseDTO {
  @ApiProperty({ example: 'product-uuid' })
  id: string;

  @ApiProperty({ example: 'Pomada Modeladora' })
  name: string;

  @ApiProperty({
    example: 'Pomada para modelagem de cabelo com fixação média',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 5000, description: 'Preço em centavos' })
  price: number;

  @ApiProperty({ example: 0.15, description: 'Comissão em decimal' })
  commission: number;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
