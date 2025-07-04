import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentCreateRequestDTO } from '../dtos/establishment-create-request.dto';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
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
  @ApiResponse({ status: 201, type: EstablishmentFindOneResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name should not be empty',
          'phone must be a valid phone number',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: user is not allowed to create establishment.',
    schema: {
      example: {
        statusCode: 403,
        message: 'User is not allowed to create establishment',
        error: 'FORBIDDEN',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: establishment already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Establishment already exists',
        error: 'ESTABLISHMENT_ALREADY_EXISTS',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Body() dto: EstablishmentCreateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentCreateService.execute(dto, userId);
  }
}
