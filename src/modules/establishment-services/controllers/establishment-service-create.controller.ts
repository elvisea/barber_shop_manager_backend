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

import { EstablishmentServiceCreateParamDTO } from '../dtos/establishment-service-create-param.dto';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceCreateService } from '../services/establishment-service-create.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceCreateController {
  constructor(
    private readonly establishmentServiceCreateService: EstablishmentServiceCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new establishment service' })
  @ApiResponse({ status: 201, type: EstablishmentServiceCreateResponseDTO })
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
    @Param() params: EstablishmentServiceCreateParamDTO,
    @Body() dto: EstablishmentServiceCreateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
