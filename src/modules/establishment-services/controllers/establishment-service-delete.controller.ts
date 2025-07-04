import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceDeleteService } from '../services/establishment-service-delete.service';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceDeleteController {
  constructor(
    private readonly establishmentServiceDeleteService: EstablishmentServiceDeleteService,
  ) { }

  @Delete()
  @ApiOperation({ summary: 'Delete service by ID' })
  @ApiResponse({ status: 200, description: 'Service deleted', schema: { example: { deleted: true } } })
  @ApiResponse({ status: 404, description: 'Service or establishment not found.' })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
  ): Promise<{ deleted: boolean }> {
    return this.establishmentServiceDeleteService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
    );
  }
} 