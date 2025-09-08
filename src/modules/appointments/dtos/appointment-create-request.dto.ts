import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class AppointmentServiceItemDTO {
  @ApiProperty({ example: 'a2f8d3b4-1234-4a5b-9c7d-1e2f3a4b5c6d' })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  price!: number;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @Type(() => Number)
  duration!: number;

  @ApiProperty({
    example: 0.4,
    description: 'Commission ratio between 0 and 1',
  })
  @Type(() => Number)
  commission!: number;
}

export class AppointmentCreateRequestDTO {
  @ApiProperty({ example: 'b3a8c7d6-89ab-4cde-9123-456789abcdef' })
  @IsUUID()
  customerId!: string;

  @ApiProperty({ example: 'c4d5e6f7-0123-4567-89ab-cdef01234567' })
  @IsUUID()
  memberId!: string;

  @ApiProperty({ example: '2025-09-15T14:00:00.000Z' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2025-09-15T14:30:00.000Z' })
  @IsDateString()
  endTime!: string;

  @ApiProperty({ example: 'Customer prefers warm water', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [AppointmentServiceItemDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentServiceItemDTO)
  services!: AppointmentServiceItemDTO[];
}
