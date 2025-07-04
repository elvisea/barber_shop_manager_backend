import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from './establishment-product-create-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentProductFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentProductCreateResponseDTO> {
  @ApiProperty({ type: [EstablishmentProductCreateResponseDTO] })
  declare data: EstablishmentProductCreateResponseDTO[];
}
