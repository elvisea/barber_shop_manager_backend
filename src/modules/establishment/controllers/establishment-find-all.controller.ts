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

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindAllController {
  constructor(
    private readonly establishmentFindAllService: EstablishmentFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find establishments (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentFindAllResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentFindAllQueryDTO,
  ): Promise<EstablishmentFindAllResponseDTO> {
    return this.establishmentFindAllService.execute(query, userId);
  }
}
