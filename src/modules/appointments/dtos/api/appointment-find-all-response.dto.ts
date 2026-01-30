import { ApiProperty } from '@nestjs/swagger';

import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';

class AppointmentListItemDTO {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  customerId!: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do cliente' })
  customerName!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ example: 'Maria Santos', description: 'Nome do profissional' })
  memberName!: string;

  @ApiProperty()
  startTime!: string;

  @ApiProperty()
  endTime!: string;

  @ApiProperty({ example: 5000, description: 'Valor total em centavos' })
  totalAmount!: number;

  @ApiProperty({ example: 30, description: 'Duração total em minutos' })
  totalDuration!: number;

  @ApiProperty({ example: 'PENDING', description: 'Status do agendamento' })
  status!: string;

  @ApiProperty({
    example: 'Cliente prefere corte mais curto',
    description: 'Observações do agendamento',
    required: false,
  })
  notes?: string;
}

export class AppointmentFindAllResponseDTO extends BasePaginatedResponseDTO<AppointmentListItemDTO> {
  @ApiProperty({ type: [AppointmentListItemDTO] })
  declare data: AppointmentListItemDTO[];
}
