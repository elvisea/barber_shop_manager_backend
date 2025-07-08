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

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard)
export class EstablishmentProductCreateController {
  constructor(
    private readonly establishmentProductCreateService: EstablishmentProductCreateService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create product for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentProductCreateResponseDTO })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  @ApiConflictResponse({
    description: SwaggerErrorExamples.establishmentProductNameAlreadyExists.description,
    schema: { example: SwaggerErrorExamples.establishmentProductNameAlreadyExists.example },
  })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
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
