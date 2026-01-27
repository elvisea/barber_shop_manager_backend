import { ApiProperty } from '@nestjs/swagger';

import { MemberProductFindOneResponseDTO } from './member-product-find-one-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class MemberProductFindAllResponseDTO extends BasePaginatedResponseDTO<MemberProductFindOneResponseDTO> {
  @ApiProperty({ type: [MemberProductFindOneResponseDTO] })
  declare data: MemberProductFindOneResponseDTO[];
}
