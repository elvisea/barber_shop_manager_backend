import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateAppointmentDocs } from '../docs';
import { AppointmentCreateRequestDTO } from '../dtos';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentCreateController {
  @Post()
  @CreateAppointmentDocs()
  async handler(@Body() dto: AppointmentCreateRequestDTO) {
    // TODO: Implementar lógica de criação de agendamento
    // dto.customerId, dto.establishmentId, dto.memberId, dto.serviceIds, etc.
  }
}
