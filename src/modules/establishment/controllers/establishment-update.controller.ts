import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetRequestId } from '../../auth/decorators/get-request-id.decorator';
import { EstablishmentIdParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentUpdateService } from '../services/establishment-update.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentUpdateController {
  constructor(
    private readonly establishmentUpdateService: EstablishmentUpdateService,
  ) {}

  @Patch(':establishmentId')
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiResponse({ status: 200, type: EstablishmentResponseDTO })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: user is not a member of the establishment.',
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentIdParamDTO,
    @Body() dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentResponseDTO> {
    return this.establishmentUpdateService.execute(
      params.establishmentId,
      userId,
      dto,
    );
  }
}
