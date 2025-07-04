import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentServiceCreateResponseDTO } from './establishment-service-create-response.dto';

export class EstablishmentServiceFindAllResponseDTO {
  @ApiProperty({ type: [EstablishmentServiceCreateResponseDTO] })
  data: EstablishmentServiceCreateResponseDTO[];

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
