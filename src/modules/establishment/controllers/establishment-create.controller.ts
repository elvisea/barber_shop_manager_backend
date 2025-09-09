import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { CreateEstablishmentDocs } from '../docs/create-establishment.docs';
import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentCreateService } from '../services/establishment-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstablishmentCreateController {
  constructor(
    private readonly establishmentCreateService: EstablishmentCreateService,
  ) {}

  @Post()
  @Roles(UserRole.OWNER)
  @CreateEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Body() dto: EstablishmentCreateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentCreateService.execute(dto, userId);
  }
}
