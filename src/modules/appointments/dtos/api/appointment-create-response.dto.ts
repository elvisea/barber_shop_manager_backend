import { ApiProperty } from '@nestjs/swagger';

import { getCurrentDate, getFutureDateTime } from '@/common/utils/date-helpers';

export class AppointmentCreateResponseDTO {
  @ApiProperty({ example: '6c2a0e2c-8f39-4c39-9a41-6a8b8a0f6b1e' })
  id!: string;

  @ApiProperty({ example: 'a1b2c3d4-5678-9abc-def0-123456789012' })
  establishmentId!: string;

  @ApiProperty({ example: 'b3a8c7d6-89ab-4cde-9123-456789abcdef' })
  customerId!: string;

  @ApiProperty({ example: 'c4d5e6f7-0123-4567-89ab-cdef01234567' })
  memberId!: string;

  @ApiProperty({ example: getFutureDateTime(1, 14, 0) })
  startTime!: string;

  @ApiProperty({ example: getFutureDateTime(1, 14, 30) })
  endTime!: string;

  @ApiProperty({ example: 5000 })
  totalAmount!: number;

  @ApiProperty({ example: 30 })
  totalDuration!: number;

  @ApiProperty({ example: 'PENDING' })
  status!: string;

  @ApiProperty({ example: 'Cliente prefere corte mais curto', required: false })
  notes?: string;

  @ApiProperty({ example: getCurrentDate() })
  createdAt!: Date;

  @ApiProperty({ example: getCurrentDate() })
  updatedAt!: Date;
}
