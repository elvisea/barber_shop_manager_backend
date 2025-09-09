import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateServiceDocs } from '../docs/create-service.docs';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceParamDTO } from '../dtos/establishment-service-param.dto';
import { EstablishmentServiceCreateService } from '../services/establishment-service-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceCreateController {
  constructor(
    private readonly establishmentServiceCreateService: EstablishmentServiceCreateService,
  ) {}

  @Post()
  @CreateServiceDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceParamDTO,
    @Body() dto: EstablishmentServiceCreateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
