import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentCreateService } from '../services/establishment-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstablishmentCreateController {
  constructor(
    private readonly establishmentCreateService: EstablishmentCreateService,
  ) { }

  @Post()
  @Roles(UserRole.OWNER)
  @ApiOperation({ summary: 'Create a new establishment' })
  @ApiResponse({ status: 201, type: EstablishmentFindOneResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS].description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS].example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Body() dto: EstablishmentCreateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentCreateService.execute(dto, userId);
  }
}
