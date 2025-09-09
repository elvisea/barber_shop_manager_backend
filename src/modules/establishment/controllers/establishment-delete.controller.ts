import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteEstablishmentDocs } from '../docs';
import { EstablishmentParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentDeleteService } from '../services/establishment-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentDeleteController {
  constructor(
    private readonly establishmentDeleteService: EstablishmentDeleteService,
  ) {}

  @Delete(':establishmentId')
  @HttpCode(204)
  @DeleteEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentParamDTO,
  ): Promise<void> {
    await this.establishmentDeleteService.execute(
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
