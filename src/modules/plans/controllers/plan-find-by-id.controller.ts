import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SwaggerErrors } from '../../../common/swagger-errors';
import { ErrorCode } from '../../../enums/error-code';
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
  @ApiOperation({ summary: 'Get plan by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: PlanCreateResponseDTO })
  @ApiResponse({
    status: 404,
    description: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].description,
    schema: { example: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].example },
  })
  async handle(@Param('id') id: string): Promise<PlanCreateResponseDTO> {
    return this.planFindByIdService.execute(id);
  }
}
