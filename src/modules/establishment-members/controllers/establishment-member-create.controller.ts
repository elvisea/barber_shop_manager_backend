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
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberCreateParamDTO } from '../dtos/establishment-member-create-param.dto';
import { EstablishmentMemberCreateRequestDTO } from '../dtos/establishment-member-create-request.dto';
import { EstablishmentMemberCreateResponseDTO } from '../dtos/establishment-member-create-response.dto';
import { EstablishmentMemberCreateService } from '../services/establishment-member-create.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
export class EstablishmentMemberCreateController {
  constructor(
    private readonly establishmentMemberCreateService: EstablishmentMemberCreateService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new establishment member' })
  @ApiResponse({ status: 201, type: EstablishmentMemberCreateResponseDTO })
  @ApiConflictResponse({
    description: SwaggerErrorExamples.establishmentMemberAlreadyExists.description,
    schema: { example: SwaggerErrorExamples.establishmentMemberAlreadyExists.example },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentNotFound.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFound.example },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        { example: SwaggerErrorExamples.establishmentNotOwnedByUser.example },
        { example: SwaggerErrorExamples.userNotAdminInEstablishment.example },
      ],
    },
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
