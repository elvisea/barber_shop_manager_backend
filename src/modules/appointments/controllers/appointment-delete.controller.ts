import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { APPOINTMENT_ALLOWED_ROLES } from '../constants/roles';
import { DeleteAppointmentDocs } from '../docs';
import { AppointmentDeleteParamDTO } from '../dtos';
import { AppointmentDeleteService } from '../services/appointment-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentDeleteController {
  constructor(
    private readonly appointmentDeleteService: AppointmentDeleteService,
  ) {}

  @Delete(':appointmentId')
  @Roles(...APPOINTMENT_ALLOWED_ROLES)
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteAppointmentDocs()
  async handler(
    @Param() params: AppointmentDeleteParamDTO,
    @GetRequestId() requesterId: string,
  ): Promise<void> {
    await this.appointmentDeleteService.execute(
      params.establishmentId,
      params.appointmentId,
      requesterId,
    );
  }
}
