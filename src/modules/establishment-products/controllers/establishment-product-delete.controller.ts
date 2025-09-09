import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteProductDocs } from '../docs/delete-product.docs';
import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductDeleteService } from '../services/establishment-product-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductDeleteController {
  constructor(
    private readonly establishmentProductDeleteService: EstablishmentProductDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @DeleteProductDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentProductDeleteService.execute(
      params.productId,
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
