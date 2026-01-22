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

export class AppointmentFindAllQueryDTO extends BasePaginationQueryDTO {
  @ApiPropertyOptional({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiPropertyOptional({
    description: 'ID do funcionário/membro',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  memberId?: string;

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
    example: '2024-01-21T00:00:00Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim para filtro',
    example: '2024-01-21T23:59:59Z',
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
  @Transform(({ value }: { value: string }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  includeDeleted?: boolean = false;
}
