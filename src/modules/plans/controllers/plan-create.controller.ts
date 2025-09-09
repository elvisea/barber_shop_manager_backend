import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreatePlanDocs } from '../docs';
import { PlanCreateRequestDTO } from '../dtos/plan-create-request.dto';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanCreateService } from '../services/plan-create.service';

@ApiTags('Plans')
@ApiBearerAuth()
@Controller('plans')
export class PlanCreateController {
  constructor(private readonly planCreateService: PlanCreateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreatePlanDocs()
  async handle(
    @Body() dto: PlanCreateRequestDTO,
  ): Promise<PlanCreateResponseDTO> {
    return this.planCreateService.execute(dto);
  }
}
