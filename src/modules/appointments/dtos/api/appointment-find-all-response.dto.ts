import { ApiProperty } from '@nestjs/swagger';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

class AppointmentListItemDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  memberId!: string;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;
}

export class AppointmentFindAllResponseDTO extends BasePaginatedResponseDTO<AppointmentListItemDTO> {
  @ApiProperty({ type: [AppointmentListItemDTO] })
  declare data: AppointmentListItemDTO[];
}
