import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AppointmentDeleteParamDTO {
  @ApiProperty({
    description: 'ID único do agendamento',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID(4)
  appointmentId: string;
}
