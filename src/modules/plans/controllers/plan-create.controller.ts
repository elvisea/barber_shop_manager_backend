import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PlanCreateRequestDTO } from '../dtos/plan-create-request.dto';
import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanCreateService } from '../services/plan-create.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanCreateController {
  constructor(private readonly planCreateService: PlanCreateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({ status: 201, type: PlanCreateResponseDTO })
  async handle(
    @Body() dto: PlanCreateRequestDTO,
  ): Promise<PlanCreateResponseDTO> {
    return this.planCreateService.execute(dto);
  }
}
