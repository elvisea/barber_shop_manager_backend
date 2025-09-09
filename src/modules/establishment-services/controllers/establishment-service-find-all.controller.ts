import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllServicesDocs } from '../docs/find-all-services.docs';
import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceParamDTO } from '../dtos/establishment-service-param.dto';
import { EstablishmentServiceFindAllService } from '../services/establishment-service-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindAllController {
  constructor(
    private readonly establishmentServiceFindAllService: EstablishmentServiceFindAllService,
  ) {}

  @Get()
  @FindAllServicesDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceParamDTO,
    @Query() query: EstablishmentServiceFindAllQueryDTO,
  ): Promise<EstablishmentServiceFindAllResponseDTO> {
    return this.establishmentServiceFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
