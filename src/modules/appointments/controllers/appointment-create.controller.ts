import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDocs } from '../docs';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentCreateController {
  @Post()
  @CreateAppointmentDocs()
  async handler() {
    // TODO: Implementar lógica de criação de agendamento
  }
}
