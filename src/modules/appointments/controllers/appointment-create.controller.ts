import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APPOINTMENT_ALLOWED_ROLES } from '../constants/roles';
import { CreateAppointmentDocs } from '../docs';
import {
  AppointmentCreateParamDTO,
  AppointmentCreateRequestDTO,
  AppointmentCreateResponseDTO,
} from '../dtos';
import { AppointmentCreateService } from '../services/appointment-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentCreateController {
  constructor(
    private readonly appointmentCreateService: AppointmentCreateService,
  ) {}

  @Post()
  @Roles(...APPOINTMENT_ALLOWED_ROLES)
  @CreateAppointmentDocs()
  async handle(
    @Param() params: AppointmentCreateParamDTO,
    @Body() dto: AppointmentCreateRequestDTO,
    @GetRequestId() userId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    return this.appointmentCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
