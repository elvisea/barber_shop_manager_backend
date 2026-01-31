import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateIf,
} from 'class-validator';

import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { getFutureDate, getPastDate } from '@/common/utils/date-helpers';

export class AppointmentFindAllQueryDTO extends BasePaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'ID do usuário/funcionário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Status do agendamento',
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiPropertyOptional({
    description: 'Data de início para filtro',
    example: getPastDate(7),
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim para filtro',
    example: getFutureDate(7),
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ValidateIf((o: AppointmentFindAllQueryDTO) => !!o.startDate && !!o.endDate)
  endDate?: Date;

  @ApiPropertyOptional({
    description:
      'Incluir registros deletados na busca (por padrão, apenas não deletados são retornados)',
    example: false,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === true || value === 'true' || value === '1') return true;
    if (value === false || value === 'false' || value === '0') return false;
    if (Array.isArray(value) && value[0] !== undefined)
      return value[0] === 'true' || value[0] === true;
    return value;
  })
  @IsBoolean()
  includeDeleted?: boolean = false;
}
