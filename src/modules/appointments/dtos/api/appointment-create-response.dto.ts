import { ApiProperty } from '@nestjs/swagger';

export class AppointmentCreateResponseDTO {
  @ApiProperty({ example: '6c2a0e2c-8f39-4c39-9a41-6a8b8a0f6b1e' })
  id!: string;

  @ApiProperty({ example: 'b3a8c7d6-89ab-4cde-9123-456789abcdef' })
  customerId!: string;

  @ApiProperty({ example: 'c4d5e6f7-0123-4567-89ab-cdef01234567' })
  memberId!: string;

  @ApiProperty({ example: '2025-09-15T14:00:00.000Z' })
  startTime!: string;

  @ApiProperty({ example: '2025-09-15T14:30:00.000Z' })
  endTime!: string;
}
