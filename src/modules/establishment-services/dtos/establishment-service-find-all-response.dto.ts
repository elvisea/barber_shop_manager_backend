import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentServiceCreateResponseDTO } from './establishment-service-create-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentServiceFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentServiceCreateResponseDTO> {
  @ApiProperty({ type: [EstablishmentServiceCreateResponseDTO] })
  declare data: EstablishmentServiceCreateResponseDTO[];
}
