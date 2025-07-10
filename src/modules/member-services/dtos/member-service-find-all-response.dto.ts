import { ApiProperty } from '@nestjs/swagger';

import { MemberServiceFindOneResponseDTO } from './member-service-find-one-response.dto';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

export class MemberServiceFindAllResponseDTO extends BasePaginatedResponseDTO<MemberServiceFindOneResponseDTO> {
  @ApiProperty({ type: [MemberServiceFindOneResponseDTO] })
  declare data: MemberServiceFindOneResponseDTO[];
}
