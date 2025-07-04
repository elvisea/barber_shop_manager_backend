import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceEstablishmentParamDTO } from '../dtos/establishment-service-establishment-param.dto';
import { EstablishmentServiceRequestDTO } from '../dtos/establishment-service-request.dto';
import { EstablishmentServiceResponseDTO } from '../dtos/establishment-service-response.dto';
import { EstablishmentServiceCreateService } from '../services/establishment-service-create.service';

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
  @ApiResponse({ status: 201, type: EstablishmentServiceResponseDTO })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden: user is not a member of the establishment or lacks ADMIN role.',
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceEstablishmentParamDTO,
    @Body() dto: EstablishmentServiceRequestDTO,
  ): Promise<EstablishmentServiceResponseDTO> {
    return this.establishmentServiceCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
