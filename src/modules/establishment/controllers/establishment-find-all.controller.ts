import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentFindAllQueryDTO } from '../dtos/establishment-find-all-query.dto';
import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';
import { EstablishmentFindAllService } from '../services/establishment-find-all.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindAllController {
  constructor(
    private readonly establishmentFindAllService: EstablishmentFindAllService,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Find establishments (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentFindAllResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentFindAllQueryDTO,
  ): Promise<EstablishmentFindAllResponseDTO> {
    return this.establishmentFindAllService.execute(query, userId);
  }
}
