import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class PlanCreateResponseDTO {
  @ApiProperty({ example: 'uuid-do-plano' })
  id: string;

  @ApiProperty({ example: 'Atendimento A.I.' })
  name: string;

  @ApiProperty({
    example:
      'Plano para uso do serviço de atendimento com inteligência artificial',
    required: false,
  })
  description?: string | null;

  @ApiProperty({ example: 1999 })
  price: number;

  @ApiProperty({ example: 30 })
  duration: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: getCurrentDate() })
  createdAt: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt: Date;
}
