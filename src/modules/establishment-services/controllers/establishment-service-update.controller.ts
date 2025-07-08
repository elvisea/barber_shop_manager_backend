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

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceUpdateRequestDTO } from '../dtos/establishment-service-update-request.dto';
import { EstablishmentServiceUpdateService } from '../services/establishment-service-update.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceUpdateController {
  constructor(
    private readonly establishmentServiceUpdateService: EstablishmentServiceUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update service by ID' })
  @ApiResponse({ status: 200, type: EstablishmentServiceCreateResponseDTO })
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
    description: SwaggerErrorExamples.establishmentServiceNotFound.description,
    schema: {
      example: SwaggerErrorExamples.establishmentServiceNotFound.example,
    },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrorExamples.establishmentServiceNameAlreadyExists.description,
    schema: {
      example:
        SwaggerErrorExamples.establishmentServiceNameAlreadyExists.example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
    @Body() dto: EstablishmentServiceUpdateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceUpdateService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
      dto,
    );
  }
}
