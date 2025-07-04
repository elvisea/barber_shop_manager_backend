import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceFindAllParamDTO } from '../dtos/establishment-service-find-all-param.dto';
import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceFindAllService } from '../services/establishment-service-find-all.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindAllController {
  constructor(
    private readonly establishmentServiceFindAllService: EstablishmentServiceFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all services (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentServiceFindAllResponseDTO })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindAllParamDTO,
    @Query() query: EstablishmentServiceFindAllQueryDTO,
  ): Promise<EstablishmentServiceFindAllResponseDTO> {
    return this.establishmentServiceFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
