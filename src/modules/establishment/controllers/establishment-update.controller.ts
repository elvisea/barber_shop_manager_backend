import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateEstablishmentDocs } from '../docs';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentUpdateService } from '../services/establishment-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentUpdateController {
  constructor(
    private readonly establishmentUpdateService: EstablishmentUpdateService,
  ) {}

  @Patch(':establishmentId')
  @UpdateEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentParamDTO,
    @Body() dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentUpdateService.execute(
      params.establishmentId,
      userId,
      dto,
    );
  }
}
