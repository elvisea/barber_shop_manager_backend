import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteAppointmentDocs } from '../docs';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentDeleteController {
  @Delete(':id')
  @DeleteAppointmentDocs()
  async handler(@Param('id') id: string) {
    // TODO: Implementar lógica de exclusão de agendamento
  }
}
