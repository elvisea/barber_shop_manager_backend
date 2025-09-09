import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindPlanByIdDocs } from '../docs';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanFindByIdService } from '../services/plan-find-by-id.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanFindByIdController {
  constructor(private readonly planFindByIdService: PlanFindByIdService) {}

  @Get(':id')
  @FindPlanByIdDocs()
  async handle(@Param('id') id: string): Promise<PlanCreateResponseDTO> {
    return this.planFindByIdService.execute(id);
  }
}
