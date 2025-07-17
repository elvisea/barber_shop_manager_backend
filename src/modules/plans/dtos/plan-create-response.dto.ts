import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
