import { ApiProperty } from '@nestjs/swagger';

export class EstablishmentProductCreateResponseDTO {
  @ApiProperty({ example: 'uuid-produto' })
  id: string;

  @ApiProperty({ example: 'uuid-estabelecimento' })
  establishmentId: string;

  @ApiProperty({ example: 'Cera Modeladora Efeito Matte' })
  name: string;

  @ApiProperty({ example: 'Alta fixação e sem brilho.' })
  description?: string;

  @ApiProperty({ example: 4500 })
  price: number;

  @ApiProperty({ example: 0.1 })
  commission: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: '2024-07-03T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-03T12:00:00Z' })
  updatedAt: Date;
}
