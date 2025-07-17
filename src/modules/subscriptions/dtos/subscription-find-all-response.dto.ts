import { ApiProperty } from '@nestjs/swagger';

import { SubscriptionCreateResponseDTO } from './subscription-create-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class SubscriptionFindAllResponseDTO extends BasePaginatedResponseDTO<SubscriptionCreateResponseDTO> {
  @ApiProperty({ type: [SubscriptionCreateResponseDTO] })
  declare data: SubscriptionCreateResponseDTO[];
}
