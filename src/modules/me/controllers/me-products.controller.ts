import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeProductsDocs } from '../docs';
import { MeEstablishmentQueryDto } from '../dtos/me-establishment-query.dto';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeProductsService } from '../services/me-products.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeProductsController {
  constructor(private readonly meProductsService: MeProductsService) {}

  @Get('products')
  @MeProductsDocs()
  async handler(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meProductsService.execute(userId, query.establishmentId);
  }
}
