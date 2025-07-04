import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ example: '2024-07-03T12:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-07-03T12:00:00Z' })
  updatedAt: Date;
}
