import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberFindAllQueryDTO } from '../dtos/establishment-member-find-all-query.dto';
import { EstablishmentMemberFindAllResponseDTO } from '../dtos/establishment-member-find-all-response.dto';
import { EstablishmentMemberFindAllService } from '../services/establishment-member-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberFindAllController {
  constructor(
    private readonly establishmentMemberFindAllService: EstablishmentMemberFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all members of an establishment (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentMemberFindAllResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].description,
    schema: {
      example: SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
    },
  })
  @ApiNotFoundResponse({
    description:
      SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param('establishmentId') establishmentId: string,
    @Query() query: EstablishmentMemberFindAllQueryDTO,
  ): Promise<EstablishmentMemberFindAllResponseDTO> {
    return this.establishmentMemberFindAllService.execute(
      query,
      establishmentId,
      userId,
    );
  }
}
