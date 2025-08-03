import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  MemberParamDTO,
  MemberResponseDTO,
  MemberUpdateRequestDTO,
} from '../dtos';
import { MemberUpdateService } from '../services/member-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberUpdateController {
  constructor(private readonly memberUpdateService: MemberUpdateService) {}

  @Patch()
  @ApiOperation({ summary: 'Update member' })
  @ApiResponse({ status: 200, type: MemberResponseDTO })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].example,
    },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
    @Body() dto: MemberUpdateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberUpdateService.execute(
      params.establishmentId,
      params.memberId,
      dto,
      userId,
    );
  }
}
