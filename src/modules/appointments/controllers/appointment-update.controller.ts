import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAppointmentDocs } from '../docs';
import {
  AppointmentUpdateParamDTO,
  AppointmentUpdateRequestDTO,
} from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentUpdateController {
  @Put(':appointmentId')
  @UpdateAppointmentDocs()
  async handler(
    @Param() _params: AppointmentUpdateParamDTO,
    @Body() _dto: AppointmentUpdateRequestDTO,
  ) {
    // TODO: Implementar lógica de atualização de agendamento
    // params.establishmentId, params.appointmentId, dto.memberId, dto.status, dto.serviceIds, etc.
  }
}
