import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APPOINTMENT_ALLOWED_ROLES } from '../constants/roles';
import { FindAppointmentByIdDocs } from '../docs';
import {
  AppointmentCreateResponseDTO,
  AppointmentFindByIdParamDTO,
} from '../dtos';
import { AppointmentFindByIdService } from '../services/appointment-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentFindByIdController {
  constructor(
    private readonly appointmentFindByIdService: AppointmentFindByIdService,
  ) {}

  @Get(':appointmentId')
  @Roles(...APPOINTMENT_ALLOWED_ROLES)
  @FindAppointmentByIdDocs()
  async handler(
    @Param() params: AppointmentFindByIdParamDTO,
    @GetRequestId() requesterId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    return this.appointmentFindByIdService.execute(
      params.establishmentId,
      params.appointmentId,
      requesterId,
    );
  }
}
