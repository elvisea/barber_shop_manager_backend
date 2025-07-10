import { ApiProperty } from '@nestjs/swagger';

export class MemberServiceFindOneResponseDTO {
  @ApiProperty({ example: 'service-uuid' })
  id: string;

  @ApiProperty({ example: 'Corte Masculino' })
  name: string;

  @ApiProperty({
    example: 'Corte tradicional masculino com acabamento',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({ example: 30, description: 'Duração em minutos' })
  duration: number;

  @ApiProperty({ example: 5000, description: 'Preço em centavos' })
  price: number;

  @ApiProperty({ example: 0.15, description: 'Comissão em decimal' })
  commission: number;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
