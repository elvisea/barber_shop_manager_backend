import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

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

@ApiTags('Agendamentos')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentCreateController {
  constructor(
    private readonly appointmentCreateService: AppointmentCreateService,
  ) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ROOT)
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
