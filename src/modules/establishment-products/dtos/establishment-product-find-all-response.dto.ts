import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from './establishment-product-create-response.dto';

export class EstablishmentProductFindAllResponseDTO {
  @ApiProperty({ type: [EstablishmentProductCreateResponseDTO] })
  data: EstablishmentProductCreateResponseDTO[];

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
