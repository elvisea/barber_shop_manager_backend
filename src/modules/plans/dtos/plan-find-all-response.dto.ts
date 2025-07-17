import { ApiProperty } from '@nestjs/swagger';

import { PlanCreateResponseDTO } from './plan-create-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class PlanFindAllResponseDTO extends BasePaginatedResponseDTO<PlanCreateResponseDTO> {
  @ApiProperty({ type: [PlanCreateResponseDTO] })
  declare data: PlanCreateResponseDTO[];
}
