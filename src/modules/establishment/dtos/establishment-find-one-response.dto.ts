import { ApiProperty } from '@nestjs/swagger';

export class EstablishmentFindOneResponseDTO {
  @ApiProperty({
    description: 'Establishment ID',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the establishment',
    example: "João's Barbershop",
  })
  name: string;

  @ApiProperty({
    description: 'Full address of the establishment',
    example: '123 Main St, Downtown, São Paulo - SP',
  })
  address: string;

  @ApiProperty({
    description: 'Phone number of the establishment',
    example: '11999999999',
  })
  phone: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-07-03T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-07-03T10:00:00Z',
  })
  updatedAt: Date;
}
