import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteAppointmentDocs } from '../docs';
import { AppointmentDeleteParamDTO } from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentDeleteController {
  @Delete(':appointmentId')
  @DeleteAppointmentDocs()
  async handler(@Param() params: AppointmentDeleteParamDTO) {
    // TODO: Implementar lógica de exclusão de agendamento
    // params.establishmentId, params.appointmentId
  }
}
