import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
    description: 'ID do estabelecimento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  establishmentId: string;

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
  @IsDateString()
  startTime: string;

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
