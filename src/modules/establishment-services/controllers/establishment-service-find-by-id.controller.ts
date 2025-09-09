import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FindServiceByIdDocs } from '../docs/find-service-by-id.docs';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceFindByIdService } from '../services/establishment-service-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindByIdController {
  constructor(
    private readonly establishmentServiceFindByIdService: EstablishmentServiceFindByIdService,
  ) {}

  @Get()
  @FindServiceByIdDocs()
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
