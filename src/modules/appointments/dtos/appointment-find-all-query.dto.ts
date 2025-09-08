import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';

export enum AppointmentStatusFilter {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

export class AppointmentFindAllQueryDTO extends BasePaginationQueryDTO {
  @ApiPropertyOptional({ example: 'a1b2c3d4-... (establishmentId)' })
  @IsUUID()
  establishmentId!: string;

  @ApiPropertyOptional({ example: 'c4d5e6f7-0123-4567-89ab-cdef01234567' })
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional({ example: 'b3a8c7d6-89ab-4cde-9123-456789abcdef' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({ enum: AppointmentStatusFilter })
  @IsOptional()
  @IsEnum(AppointmentStatusFilter)
  status?: AppointmentStatusFilter;

  @ApiPropertyOptional({ example: '2025-09-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-09-15T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
