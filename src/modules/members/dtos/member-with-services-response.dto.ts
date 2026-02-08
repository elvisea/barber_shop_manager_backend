import { ApiProperty } from '@nestjs/swagger';

export class MemberServiceDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
  id: string;

  @ApiProperty({ example: 'Corte de Cabelo' })
  name: string;
}

export class MemberWithServicesResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  id: string;

  @ApiProperty({ example: 'João da Silva' })
  name: string;

  @ApiProperty({ type: [MemberServiceDTO] })
  services: MemberServiceDTO[];
}
