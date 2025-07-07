import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { EstablishmentServiceCreateParamDTO } from '../dtos/establishment-service-create-param.dto';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceCreateService } from '../services/establishment-service-create.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
@Roles(Role.ADMIN)
export class EstablishmentServiceCreateController {
  constructor(
    private readonly establishmentServiceCreateService: EstablishmentServiceCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new establishment service' })
  @ApiResponse({ status: 201, type: EstablishmentServiceCreateResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'price must be an integer'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: user is not a member of the establishment or lacks ADMIN role.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: service name already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Service name already exists',
        error: 'ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceCreateParamDTO,
    @Body() dto: EstablishmentServiceCreateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
