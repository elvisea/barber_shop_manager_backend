import { ApiProperty } from '@nestjs/swagger';

import { AppointmentServiceItemDTO } from './appointment-create-response.dto';

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
