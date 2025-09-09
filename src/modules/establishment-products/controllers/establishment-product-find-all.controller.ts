import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindAllProductsDocs } from '../docs/find-all-products.docs';
import { EstablishmentProductCreateParamDTO } from '../dtos/establishment-product-create-param.dto';
import { EstablishmentProductFindAllQueryDTO } from '../dtos/establishment-product-find-all-query.dto';
import { EstablishmentProductFindAllResponseDTO } from '../dtos/establishment-product-find-all-response.dto';
import { EstablishmentProductFindAllService } from '../services/establishment-product-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductFindAllController {
  constructor(
    private readonly establishmentProductFindAllService: EstablishmentProductFindAllService,
  ) {}

  @Get()
  @FindAllProductsDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductCreateParamDTO,
    @Query() query: EstablishmentProductFindAllQueryDTO,
  ): Promise<EstablishmentProductFindAllResponseDTO> {
    return this.establishmentProductFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
