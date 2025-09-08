import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAppointmentByIdDocs } from '../docs';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentFindByIdController {
  @Get(':id')
  @FindAppointmentByIdDocs()
  async handler(@Param('id') id: string) {
    // TODO: Implementar lógica de busca de agendamento por ID
  }
}
