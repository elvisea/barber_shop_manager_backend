import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentProductCreateParamDTO } from '../dtos/establishment-product-create-param.dto';
import { EstablishmentProductFindAllQueryDTO } from '../dtos/establishment-product-find-all-query.dto';
import { EstablishmentProductFindAllResponseDTO } from '../dtos/establishment-product-find-all-response.dto';
import { EstablishmentProductFindAllService } from '../services/establishment-product-find-all.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductFindAllController {
  constructor(
    private readonly establishmentProductFindAllService: EstablishmentProductFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all products (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentProductFindAllResponseDTO })
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
