import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDocs } from '../docs';
import { AppointmentCreateRequestDTO } from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentCreateController {
  @Post()
  @CreateAppointmentDocs()
  async handler(
    @Param('establishmentId') establishmentId: string,
    @Body() dto: AppointmentCreateRequestDTO,
  ) {
    // TODO: Implementar lógica de criação de agendamento
    // establishmentId, dto.customerId, dto.memberId, dto.serviceIds, etc.
  }
}
