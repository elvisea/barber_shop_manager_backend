import { ApiProperty } from '@nestjs/swagger';

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

export class AppointmentFindAllResponseDTO {
  @ApiProperty({ type: [AppointmentListItemDTO] })
  items!: AppointmentListItemDTO[];

  @ApiProperty()
  total!: number;
}
