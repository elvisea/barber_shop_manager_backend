import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MemberResponseDTO } from '../dtos';
import { MemberParamDTO } from '../dtos/member-param.dto';
import { MemberFindByIdService } from '../services/member-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberFindByIdController {
  constructor(private readonly memberFindByIdService: MemberFindByIdService) {}

  @Get()
  @ApiOperation({ summary: 'Find member by ID' })
  @ApiResponse({ status: 200, type: MemberResponseDTO })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
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
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberFindByIdService.execute(
      params.establishmentId,
      params.memberId,
      userId,
    );
  }
}
