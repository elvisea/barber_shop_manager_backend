import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentMemberFindByIdResponseDTO } from './establishment-member-find-by-id-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentMemberFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentMemberFindByIdResponseDTO> {
  @ApiProperty({ isArray: true, type: EstablishmentMemberFindByIdResponseDTO })
  declare data: EstablishmentMemberFindByIdResponseDTO[];
}
