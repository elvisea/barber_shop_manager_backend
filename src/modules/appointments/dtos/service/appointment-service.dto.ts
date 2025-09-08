import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class AppointmentServiceDTO {
  @ApiProperty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty()
  @Type(() => Number)
  price!: number;

  @ApiProperty()
  @Type(() => Number)
  duration!: number;

  @ApiProperty()
  @Type(() => Number)
  commission!: number;
}
