import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateProductDocs } from '../docs/create-product.docs';
import { EstablishmentProductCreateParamDTO } from '../dtos/establishment-product-create-param.dto';
import { EstablishmentProductCreateRequestDTO } from '../dtos/establishment-product-create-request.dto';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductCreateService } from '../services/establishment-product-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductCreateController {
  constructor(
    private readonly establishmentProductCreateService: EstablishmentProductCreateService,
  ) {}

  @Post()
  @CreateProductDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductCreateParamDTO,
    @Body() dto: EstablishmentProductCreateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
