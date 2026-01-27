import { ApiProperty } from '@nestjs/swagger';

import { MemberResponseDTO } from './member-response.dto';

export class MemberRelationshipsSummaryDTO {
  @ApiProperty({
    example: 5,
    description: 'Total de serviços atribuídos ao membro',
  })
  services: { total: number };

  @ApiProperty({
    example: 3,
    description: 'Total de produtos atribuídos ao membro',
  })
  products: { total: number };

  @ApiProperty({
    example: 5,
    description: 'Total de horários de trabalho configurados',
  })
  workingHours: { total: number };

  @ApiProperty({
    example: 2,
    description: 'Total de períodos de ausência registrados',
  })
  absencePeriods: { total: number };
}

export class MemberSummaryResponseDTO {
  @ApiProperty({ type: MemberResponseDTO })
  member: MemberResponseDTO;

  @ApiProperty({ type: MemberRelationshipsSummaryDTO })
  relationships: MemberRelationshipsSummaryDTO;
}
