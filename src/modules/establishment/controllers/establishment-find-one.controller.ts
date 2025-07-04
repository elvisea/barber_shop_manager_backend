import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentFindOneParamDTO } from '../dtos/establishment-find-one-param.dto';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentFindOneService } from '../services/establishment-find-one.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindOneController {
  constructor(
    private readonly establishmentFindOneService: EstablishmentFindOneService,
  ) {}

  @Get(':establishmentId')
  @ApiOperation({ summary: 'Find establishment by id' })
  @ApiResponse({ status: 200, type: EstablishmentFindOneResponseDTO })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: user is not a member of the establishment.',
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentFindOneParamDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentFindOneService.execute(
      params.establishmentId,
      userId,
    );
  }
}
