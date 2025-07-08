import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductUpdateRequestDTO } from '../dtos/establishment-product-update-request.dto';
import { EstablishmentProductUpdateService } from '../services/establishment-product-update.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductUpdateController {
  constructor(
    private readonly establishmentProductUpdateService: EstablishmentProductUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update product by ID' })
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
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]
          .example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductFindByIdParamDTO,
    @Body() dto: EstablishmentProductUpdateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductUpdateService.execute(
      params.productId,
      params.establishmentId,
      userId,
      dto,
    );
  }
}
