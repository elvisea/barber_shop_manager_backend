import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceCreateService } from '../services/member-service-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId/services')
@UseGuards(JwtAuthGuard)
export class MemberServiceCreateController {
  constructor(
    private readonly memberServiceCreateService: MemberServiceCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign a service to a member in an establishment' })
  @ApiResponse({ status: 201, type: MemberServiceCreateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
              .example,
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND].example,
        },
      ],
    },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS].example,
    },
  })
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceCreateParamDTO,
    @Body() dto: MemberServiceCreateRequestDTO,
  ): Promise<MemberServiceCreateResponseDTO> {
    return this.memberServiceCreateService.execute(
      dto,
      params.establishmentId,
      params.memberId,
      requesterId,
    );
  }
}
