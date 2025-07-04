import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentResponseDTO } from './establishment-response.dto';

export class EstablishmentPaginatedResponse {
  @ApiProperty({ type: [EstablishmentResponseDTO] })
  data: EstablishmentResponseDTO[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: { items: 100, pages: 10 },
    },
  })
  meta: {
    page: number;
    limit: number;
    total: {
      items: number;
      pages: number;
    };
  };
}
