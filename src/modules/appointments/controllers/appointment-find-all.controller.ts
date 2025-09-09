import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllAppointmentsDocs } from '../docs';
import {
  AppointmentFindAllParamDTO,
  AppointmentFindAllQueryDTO,
  AppointmentFindAllResponseDTO,
} from '../dtos';
import { AppointmentFindAllService } from '../services/appointment-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Appointments')
@Controller('establishments/:establishmentId/appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentFindAllController {
  constructor(
    private readonly appointmentFindAllService: AppointmentFindAllService,
  ) {}

  @Get()
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
