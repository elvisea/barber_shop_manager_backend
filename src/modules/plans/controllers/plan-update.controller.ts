import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PlanCreateResponseDTO } from '../dtos/plan-create-response.dto';
import { PlanUpdateRequestDTO } from '../dtos/plan-update-request.dto';
import { PlanUpdateService } from '../services/plan-update.service';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanUpdateController {
  constructor(private readonly planUpdateService: PlanUpdateService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update plan by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: PlanCreateResponseDTO })
  @ApiResponse({
    status: 404,
    description: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].description,
    schema: { example: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].example },
  })
  async handle(
    @Param('id') id: string,
    @Body() dto: PlanUpdateRequestDTO,
  ): Promise<PlanCreateResponseDTO> {
    return this.planUpdateService.execute(id, dto);
  }
}
