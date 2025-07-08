import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberCreateParamDTO } from '../dtos/establishment-member-create-param.dto';
import { EstablishmentMemberCreateRequestDTO } from '../dtos/establishment-member-create-request.dto';
import { EstablishmentMemberCreateResponseDTO } from '../dtos/establishment-member-create-response.dto';
import { EstablishmentMemberCreateService } from '../services/establishment-member-create.service';

import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
export class EstablishmentMemberCreateController {
  constructor(
    private readonly establishmentMemberCreateService: EstablishmentMemberCreateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new establishment member' })
  @ApiResponse({ status: 201, type: EstablishmentMemberCreateResponseDTO })
  @ApiResponse({
    status: 409,
    description: ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
  })
  @ApiResponse({ status: 404, description: ErrorCode.ESTABLISHMENT_NOT_FOUND })
  @ApiResponse({
    status: 403,
    description: ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
  })
  @ApiResponse({
    status: 403,
    description: ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
  })
  async handle(
    @Param() params: EstablishmentMemberCreateParamDTO,
    @Body() dto: EstablishmentMemberCreateRequestDTO,
  ): Promise<EstablishmentMemberCreateResponseDTO> {
    return this.establishmentMemberCreateService.execute(
      dto,
      params.establishmentId,
    );
  }
}
