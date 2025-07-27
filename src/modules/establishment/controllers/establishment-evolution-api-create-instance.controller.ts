import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentEvolutionApiCreateInstanceResponseDTO } from '../dtos/establishment-evolution-api-create-instance-response.dto';
import { EstablishmentParamDTO } from '../dtos/establishment-param.dto';
import { EstablishmentEvolutionApiCreateInstanceService } from '../services/establishment-evolution-api-create-instance.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/evolution-api')
@UseGuards(JwtAuthGuard)
export class EstablishmentEvolutionApiCreateInstanceController {
  constructor(
    private readonly establishmentEvolutionApiCreateInstanceService: EstablishmentEvolutionApiCreateInstanceService,
  ) {}

  @Post('instance')
  @ApiOperation({
    summary: 'Criar nova instância na Evolution API para o estabelecimento',
  })
  @ApiResponse({
    status: 201,
    description: 'Instância criada com sucesso',
    type: EstablishmentEvolutionApiCreateInstanceResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Estabelecimento não encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
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
