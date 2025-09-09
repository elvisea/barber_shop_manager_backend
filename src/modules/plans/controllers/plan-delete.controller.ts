import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeletePlanDocs } from '../docs';
import { PlanDeleteService } from '../services/plan-delete.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanDeleteController {
  constructor(private readonly planDeleteService: PlanDeleteService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeletePlanDocs()
  async handle(@Param('id') id: string): Promise<void> {
    await this.planDeleteService.execute(id);
  }
}
