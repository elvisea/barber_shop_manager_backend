import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class AppointmentServiceItemDTO {
  @IsUUID()
  serviceId!: string;

  @Type(() => Number)
  price!: number;

  @Type(() => Number)
  duration!: number;

  @Type(() => Number)
  commission!: number;
}

export class AppointmentUpdateRequestDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  memberId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ type: [AppointmentServiceItemDTO] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentServiceItemDTO)
  services?: AppointmentServiceItemDTO[];
}
