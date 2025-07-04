import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentCustomerCreateResponseDTO } from './establishment-customer-create-response.dto';

class MetaTotal {
  @ApiProperty({ example: 1 })
  items: number;

  @ApiProperty({ example: 1 })
  pages: number;
}

class Meta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ type: MetaTotal })
  total: MetaTotal;
}

export class EstablishmentCustomerFindAllResponseDTO {
  @ApiProperty({ type: [EstablishmentCustomerCreateResponseDTO] })
  data: EstablishmentCustomerCreateResponseDTO[];

  @ApiProperty({ type: Meta })
  meta: Meta;
}
