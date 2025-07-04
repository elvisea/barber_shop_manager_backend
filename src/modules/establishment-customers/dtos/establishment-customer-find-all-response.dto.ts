import { ApiProperty } from '@nestjs/swagger';

import { EstablishmentCustomerCreateResponseDTO } from './establishment-customer-create-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class EstablishmentCustomerFindAllResponseDTO extends BasePaginatedResponseDTO<EstablishmentCustomerCreateResponseDTO> {
  @ApiProperty({ type: [EstablishmentCustomerCreateResponseDTO] })
  declare data: EstablishmentCustomerCreateResponseDTO[];
}
