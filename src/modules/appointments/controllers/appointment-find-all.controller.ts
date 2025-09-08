import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllAppointmentsDocs } from '../docs';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentFindAllController {
  @Get()
  @FindAllAppointmentsDocs()
  async handler() {
    // TODO: Implementar lógica de listagem de agendamentos
  }
}
