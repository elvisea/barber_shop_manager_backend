import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentFindOneResponseDTO } from './establishment-find-one-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentFindOneResponseDTO> {
  @ApiProperty({ type: [EstablishmentFindOneResponseDTO] })
  declare data: EstablishmentFindOneResponseDTO[];
}
