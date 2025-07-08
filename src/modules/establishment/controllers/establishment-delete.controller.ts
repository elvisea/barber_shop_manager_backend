import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentUpdateParamDTO } from '../dtos/establishment-update-param.dto';
import { EstablishmentDeleteService } from '../services/establishment-delete.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentDeleteController {
  constructor(
    private readonly establishmentDeleteService: EstablishmentDeleteService,
  ) { }

  @Delete(':establishmentId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete establishment by ID' })
  @ApiNoContentResponse({ description: 'Establishment deleted successfully' })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentUpdateParamDTO,
  ): Promise<void> {
    await this.establishmentDeleteService.execute(
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
