import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdatePlanDocs } from '../docs';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanUpdateRequestDTO } from '../dtos/plan-update-request.dto';
import { PlanUpdateService } from '../services/plan-update.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanUpdateController {
  constructor(private readonly planUpdateService: PlanUpdateService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UpdatePlanDocs()
  async handle(
    @Param('id') id: string,
    @Body() dto: PlanUpdateRequestDTO,
  ): Promise<PlanCreateResponseDTO> {
    return this.planUpdateService.execute(id, dto);
  }
}
