import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeServicesDocs } from '../docs';
import { MeEstablishmentQueryDto } from '../dtos/me-establishment-query.dto';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeServicesService } from '../services/me-services.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeServicesController {
  constructor(private readonly meServicesService: MeServicesService) {}

  @Get('services')
  @MeServicesDocs()
  async handler(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meServicesService.execute(userId, query.establishmentId);
  }
}
