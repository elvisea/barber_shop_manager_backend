import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllAppointmentsDocs } from '../docs';
import { AppointmentFindAllQueryDTO } from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentFindAllController {
  @Get()
  @FindAllAppointmentsDocs()
  async handler(
    @Param('establishmentId') establishmentId: string,
    @Query() query: AppointmentFindAllQueryDTO,
  ) {
    // TODO: Implementar lógica de listagem de agendamentos
    // establishmentId, query.customerId, query.memberId, query.status, etc.
  }
}
