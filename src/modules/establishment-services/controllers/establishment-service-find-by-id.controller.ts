import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceFindByIdService } from '../services/establishment-service-find-by-id.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindByIdController {
  constructor(
    private readonly establishmentServiceFindByIdService: EstablishmentServiceFindByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find service by ID' })
  @ApiResponse({ status: 200, type: EstablishmentServiceCreateResponseDTO })
  @ApiResponse({ status: 404, description: 'Service not found.' })
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
