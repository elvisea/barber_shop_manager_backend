import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductFindByIdService } from '../services/establishment-product-find-by-id.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductFindByIdController {
  constructor(
    private readonly establishmentProductFindByIdService: EstablishmentProductFindByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find product by ID' })
  @ApiResponse({ status: 200, type: EstablishmentProductCreateResponseDTO })
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
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductFindByIdService.execute(
      params.productId,
      params.establishmentId,
      userId,
    );
  }
}
