import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductDeleteService } from '../services/establishment-product-delete.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductDeleteController {
  constructor(
    private readonly establishmentProductDeleteService: EstablishmentProductDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiNoContentResponse({ description: 'Product deleted successfully' })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .example,
    },
  })
  @ApiNotFoundResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].example,
    },
  })
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
