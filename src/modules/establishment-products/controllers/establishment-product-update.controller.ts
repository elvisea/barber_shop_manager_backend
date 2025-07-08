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

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductUpdateController {
  constructor(
    private readonly establishmentProductUpdateService: EstablishmentProductUpdateService,
  ) { }

  @Patch()
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, type: EstablishmentProductCreateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentProductNotFound.description,
    schema: { example: SwaggerErrorExamples.establishmentProductNotFound.example },
  })
  @ApiConflictResponse({
    description: SwaggerErrorExamples.establishmentProductNameAlreadyExists.description,
    schema: { example: SwaggerErrorExamples.establishmentProductNameAlreadyExists.example },
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
