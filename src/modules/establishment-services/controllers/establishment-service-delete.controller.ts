import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceDeleteService } from '../services/establishment-service-delete.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceDeleteController {
  constructor(
    private readonly establishmentServiceDeleteService: EstablishmentServiceDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete service by ID' })
  @ApiNoContentResponse({ description: 'Service deleted successfully' })
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
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentServiceDeleteService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
