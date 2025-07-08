import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentProductCreateParamDTO } from '../dtos/establishment-product-create-param.dto';
import { EstablishmentProductCreateRequestDTO } from '../dtos/establishment-product-create-request.dto';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductCreateService } from '../services/establishment-product-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductCreateController {
  constructor(
    private readonly establishmentProductCreateService: EstablishmentProductCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create product for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentProductCreateResponseDTO })
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
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
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
