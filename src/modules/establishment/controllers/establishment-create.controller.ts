import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateEstablishmentRequestDTO } from '../dtos/create-establishment-request.dto';
import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentCreateService } from '../services/establishment-create.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentCreateController {
  constructor(
    private readonly establishmentCreateService: EstablishmentCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new establishment' })
  @ApiResponse({ status: 201, type: EstablishmentResponseDTO })
  async handle(
    @GetRequestId() userId: string,
    @Body() dto: CreateEstablishmentRequestDTO,
  ): Promise<EstablishmentResponseDTO> {
    return this.establishmentCreateService.execute(dto, userId);
  }
}
