import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SubscriptionCreateParamDTO } from '../dtos/subscription-create-param.dto';
import { SubscriptionCreateRequestDTO } from '../dtos/subscription-create-request.dto';
import { SubscriptionCreateResponseDTO } from '../dtos/subscription-create-response.dto';
import { SubscriptionCreateService } from '../services/subscription-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionCreateController {
  constructor(
    private readonly subscriptionCreateService: SubscriptionCreateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subscription for establishment' })
  @ApiResponse({ status: 201, type: SubscriptionCreateResponseDTO })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: SubscriptionCreateParamDTO,
    @Body() dto: SubscriptionCreateRequestDTO,
  ): Promise<SubscriptionCreateResponseDTO> {
    // O service pode receber establishmentId e userId se necessário
    return this.subscriptionCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
