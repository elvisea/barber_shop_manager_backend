import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindProductByIdDocs } from '../docs/find-product-by-id.docs';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductFindByIdService } from '../services/establishment-product-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@Controller('products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductFindByIdController {
  constructor(
    private readonly establishmentProductFindByIdService: EstablishmentProductFindByIdService,
  ) {}

  @Get()
  @FindProductByIdDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductFindByIdParamDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductFindByIdService.execute(
      params.productId,
      userId,
    );
  }
}
