import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
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

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EstablishmentMemberCreateRequestDTO } from '../dtos/establishment-member-create-request.dto';
import { EstablishmentMemberCreateResponseDTO } from '../dtos/establishment-member-create-response.dto';
import { EstablishmentMemberParamDTO } from '../dtos/establishment-member-param.dto';
import { EstablishmentMemberCreateService } from '../services/establishment-member-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberCreateController {
  constructor(
    private readonly establishmentMemberCreateService: EstablishmentMemberCreateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new establishment member' })
  @ApiResponse({ status: 201, type: EstablishmentMemberCreateResponseDTO })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS].description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS].example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentMemberParamDTO,
    @Body() dto: EstablishmentMemberCreateRequestDTO,
  ): Promise<EstablishmentMemberCreateResponseDTO> {
    return this.establishmentMemberCreateService.execute(
      dto,
      params.establishmentId,
      params.memberId,
      userId,
    );
  }
}
