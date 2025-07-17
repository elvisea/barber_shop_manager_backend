import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PlanFindAllQueryDTO } from '../dtos/plan-find-all-query.dto';
import { PlanFindAllResponseDTO } from '../dtos/plan-find-all-response.dto';
import { PlanFindAllService } from '../services/plan-find-all.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Plans')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanFindAllController {
  constructor(private readonly planFindAllService: PlanFindAllService) {}

  @Get()
  @ApiOperation({ summary: 'List all plans (paginated)' })
  @ApiResponse({ status: 200, type: PlanFindAllResponseDTO })
  async handle(
    @Query() query: PlanFindAllQueryDTO,
  ): Promise<PlanFindAllResponseDTO> {
    return this.planFindAllService.execute(query);
  }
}
