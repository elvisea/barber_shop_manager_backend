import { ApiProperty } from '@nestjs/swagger';

class AppointmentServiceItemDTO {
  @ApiProperty()
  serviceId!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  duration!: number;

  @ApiProperty()
  commission!: number;
}

export class AppointmentFindOneResponseDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty({ type: [AppointmentServiceItemDTO] })
  services!: AppointmentServiceItemDTO[];
}
