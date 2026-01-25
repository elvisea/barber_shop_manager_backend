import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeleteServiceDocs } from '../docs/delete-service.docs';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceDeleteService } from '../services/establishment-service-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@Controller('services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceDeleteController {
  constructor(
    private readonly establishmentServiceDeleteService: EstablishmentServiceDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @DeleteServiceDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentServiceDeleteService.execute(
      params.serviceId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
