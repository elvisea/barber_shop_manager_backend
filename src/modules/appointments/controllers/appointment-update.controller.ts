import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APPOINTMENT_ALLOWED_ROLES } from '../constants/roles';
import { UpdateAppointmentDocs } from '../docs';
import {
  AppointmentCreateResponseDTO,
  AppointmentUpdateParamDTO,
  AppointmentUpdateRequestDTO,
} from '../dtos';
import { AppointmentUpdateService } from '../services/appointment-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentUpdateController {
  constructor(
    private readonly appointmentUpdateService: AppointmentUpdateService,
  ) {}

  @Patch(':appointmentId')
  @Roles(...APPOINTMENT_ALLOWED_ROLES)
  @UpdateAppointmentDocs()
  async handle(
    @Param() params: AppointmentUpdateParamDTO,
    @Body() dto: AppointmentUpdateRequestDTO,
    @GetRequestId() userId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    return this.appointmentUpdateService.execute(
      params.establishmentId,
      params.appointmentId,
      dto,
      userId,
    );
  }
}
