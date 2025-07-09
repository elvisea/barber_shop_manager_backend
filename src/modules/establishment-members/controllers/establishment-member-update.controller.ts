import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberUpdateRequestDTO } from '../dtos/establishment-member-update-request.dto';
import { EstablishmentMemberUpdateResponseDTO } from '../dtos/establishment-member-update-response.dto';
import { EstablishmentMemberUpdateService } from '../services/establishment-member-update.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberUpdateController {
  constructor(
    private readonly establishmentMemberUpdateService: EstablishmentMemberUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update an establishment member' })
  @ApiResponse({ status: 200, type: EstablishmentMemberUpdateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .example,
    },
  })
  @ApiNotFoundResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].description,
    schema: {
      example: SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param('establishmentId') establishmentId: string,
    @Param('memberId') memberId: string,
    @Body() dto: EstablishmentMemberUpdateRequestDTO,
  ): Promise<EstablishmentMemberUpdateResponseDTO> {
    return this.establishmentMemberUpdateService.execute(
      establishmentId,
      memberId,
      userId,
      dto,
    );
  }
}
