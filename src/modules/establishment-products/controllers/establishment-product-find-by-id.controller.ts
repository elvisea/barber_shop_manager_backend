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
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['productId must be a valid UUID'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: establishment not found or access denied.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
        error: 'ESTABLISHMENT_PRODUCT_NOT_FOUND',
      },
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
