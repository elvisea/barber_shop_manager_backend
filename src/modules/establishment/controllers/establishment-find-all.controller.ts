import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindAllEstablishmentsDocs } from '../docs';
import { EstablishmentFindAllQueryDTO } from '../dtos/establishment-find-all-query.dto';
import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';
import { EstablishmentFindAllService } from '../services/establishment-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindAllController {
  constructor(
    private readonly establishmentFindAllService: EstablishmentFindAllService,
  ) {}

  @Get()
  @FindAllEstablishmentsDocs()
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentFindAllQueryDTO,
  ): Promise<EstablishmentFindAllResponseDTO> {
    return this.establishmentFindAllService.execute(query, userId);
  }
}
