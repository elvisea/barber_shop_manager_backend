import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SwaggerErrors } from '../../../common/swagger-errors';
import { ErrorCode } from '../../../enums/error-code';
import { PlanDeleteService } from '../services/plan-delete.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Plans')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlanDeleteController {
  constructor(private readonly planDeleteService: PlanDeleteService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete plan by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Plan deleted successfully' })
  @ApiResponse({
    status: 404,
    description: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].description,
    schema: { example: SwaggerErrors[ErrorCode.PLAN_NOT_FOUND].example },
  })
  async handle(@Param('id') id: string): Promise<void> {
    await this.planDeleteService.execute(id);
  }
}
