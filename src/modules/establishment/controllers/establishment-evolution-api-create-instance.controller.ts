import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateEvolutionApiInstanceDocs } from '../docs/create-evolution-api-instance.docs';
import { EstablishmentEvolutionApiCreateInstanceResponseDTO } from '../dtos/establishment-evolution-api-create-instance-response.dto';
import { EstablishmentParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentEvolutionApiCreateInstanceService } from '../services/establishment-evolution-api-create-instance.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishments')
@Controller('establishments/:establishmentId/evolution-api')
@UseGuards(JwtAuthGuard)
export class EstablishmentEvolutionApiCreateInstanceController {
  constructor(
    private readonly establishmentEvolutionApiCreateInstanceService: EstablishmentEvolutionApiCreateInstanceService,
  ) {}

  @Post('instance')
  @CreateEvolutionApiInstanceDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentParamDTO,
  ): Promise<EstablishmentEvolutionApiCreateInstanceResponseDTO> {
    return this.establishmentEvolutionApiCreateInstanceService.execute(
      params.establishmentId,
      userId,
    );
  }
}
