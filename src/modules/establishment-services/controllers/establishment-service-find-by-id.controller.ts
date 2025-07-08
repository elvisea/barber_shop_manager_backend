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

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceFindByIdService } from '../services/establishment-service-find-by-id.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindByIdController {
  constructor(
    private readonly establishmentServiceFindByIdService: EstablishmentServiceFindByIdService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Find service by ID' })
  @ApiResponse({ status: 200, type: EstablishmentServiceCreateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentServiceNotFound.description,
    schema: { example: SwaggerErrorExamples.establishmentServiceNotFound.example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceFindByIdService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
    );
  }
}
