import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinDate,
} from 'class-validator';

export class AppointmentCreateRequestDTO {
  @ApiProperty({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  customerId: string;

  @ApiProperty({
    description: 'ID do funcionário/membro',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @ApiProperty({
    description: 'Data e hora de início do agendamento',
    example: '2024-01-21T10:00:00Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MinDate(() => new Date(), {
    message: 'startTime must not be in the past',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Observações do agendamento',
    example: 'Cliente prefere corte mais curto',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'IDs dos serviços do agendamento',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
    type: [String],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  serviceIds: string[];
}
