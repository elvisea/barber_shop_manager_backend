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

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
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
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: {
      example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentProductNotFound.description,
    schema: {
      example: SwaggerErrorExamples.establishmentProductNotFound.example,
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
