import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentFindOneResponseDTO } from './establishment-find-one-response.dto';

export class EstablishmentFindAllResponseDTO {
  @ApiProperty({ type: [EstablishmentFindOneResponseDTO] })
  data: EstablishmentFindOneResponseDTO[];

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
