import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentServiceResponseDTO } from './establishment-service-response.dto';

export class EstablishmentServicePaginatedResponse {
  @ApiProperty({ type: [EstablishmentServiceResponseDTO] })
  data: EstablishmentServiceResponseDTO[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: {
        items: 25,
        pages: 3,
      },
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
