import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetRequestId } from '../../auth/decorators/get-request-id.decorator';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentUpdateParamDTO } from '../dtos/establishment-update-param.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentUpdateService } from '../services/establishment-update.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentUpdateController {
  constructor(
    private readonly establishmentUpdateService: EstablishmentUpdateService,
  ) { }

  @Patch(':establishmentId')
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiResponse({ status: 200, type: EstablishmentFindOneResponseDTO })
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
    @Body() dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentUpdateService.execute(
      params.establishmentId,
      userId,
      dto,
    );
  }
}
