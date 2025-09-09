import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllPlansDocs } from '../docs';
import { PlanFindAllQueryDTO } from '../dtos/plan-find-all-query.dto';
import { PlanFindAllResponseDTO } from '../dtos/plan-find-all-response.dto';
import { PlanFindAllService } from '../services/plan-find-all.service';

@ApiTags('Plans')
@Controller('plans')
export class PlanFindAllController {
  constructor(private readonly planFindAllService: PlanFindAllService) {}

  @Get()
  @FindAllPlansDocs()
  async handle(
    @Query() query: PlanFindAllQueryDTO,
  ): Promise<PlanFindAllResponseDTO> {
    return this.planFindAllService.execute(query);
  }
}
