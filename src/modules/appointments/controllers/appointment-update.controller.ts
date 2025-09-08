import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateAppointmentDocs } from '../docs';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentUpdateController {
  @Put(':id')
  @UpdateAppointmentDocs()
  async handler(@Param('id') id: string, @Body() dto: any) {
    // TODO: Implementar lógica de atualização de agendamento
  }
}
