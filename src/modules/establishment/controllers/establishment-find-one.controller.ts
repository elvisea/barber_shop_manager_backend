import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindEstablishmentByIdDocs } from '../docs';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentFindOneService } from '../services/establishment-find-one.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindOneController {
  constructor(
    private readonly establishmentFindOneService: EstablishmentFindOneService,
  ) {}

  @Get(':establishmentId')
  @FindEstablishmentByIdDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentParamDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentFindOneService.execute(
      params.establishmentId,
      userId,
    );
  }
}
