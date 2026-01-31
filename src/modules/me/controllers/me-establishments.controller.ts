import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeEstablishmentsDocs } from '../docs';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeEstablishmentsService } from '../services/me-establishments.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeEstablishmentsController {
  constructor(
    private readonly meEstablishmentsService: MeEstablishmentsService,
  ) {}

  @Get('establishments')
  @MeEstablishmentsDocs()
  async handler(@GetRequestId() userId: string): Promise<MeIdNameDto[]> {
    return this.meEstablishmentsService.execute(userId);
  }
}
