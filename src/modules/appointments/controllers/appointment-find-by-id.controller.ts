import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAppointmentByIdDocs } from '../docs';
import { AppointmentFindByIdParamDTO } from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentFindByIdController {
  @Get(':appointmentId')
  @FindAppointmentByIdDocs()
  async handler(@Param() params: AppointmentFindByIdParamDTO) {
    // TODO: Implementar lógica de busca de agendamento por ID
    // params.appointmentId
  }
}
