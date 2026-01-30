import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APPOINTMENT_ALLOWED_ROLES } from '../constants/roles';
import { FindAllAppointmentsDocs } from '../docs';
import {
  AppointmentFindAllParamDTO,
  AppointmentFindAllQueryDTO,
  AppointmentFindAllResponseDTO,
} from '../dtos';
import { AppointmentFindAllService } from '../services/appointment-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentFindAllController {
  constructor(
    private readonly appointmentFindAllService: AppointmentFindAllService,
  ) {}

  @Get()
  @Roles(...APPOINTMENT_ALLOWED_ROLES)
  @FindAllAppointmentsDocs()
  async handler(
    @Param() params: AppointmentFindAllParamDTO,
    @Query() query: AppointmentFindAllQueryDTO,
    @GetRequestId() requesterId: string,
  ): Promise<AppointmentFindAllResponseDTO> {
    return this.appointmentFindAllService.execute(
      params.establishmentId,
      query,
      requesterId,
    );
  }
}
