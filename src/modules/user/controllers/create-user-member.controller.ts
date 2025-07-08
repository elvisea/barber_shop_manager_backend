import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserMemberRequestDTO } from '../dtos/create-user-member-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserMemberService } from '../services/create-user-member.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users/members')
@UseGuards(JwtAuthGuard)
export class CreateUserMemberController {
  constructor(
    private readonly createUserMemberService: CreateUserMemberService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new member user (not ADMIN)' })
  @ApiResponse({ status: 201, type: CreateUserResponseDTO })
  @ApiConflictResponse({
    description: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].description,
    schema: { example: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].example },
  })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  async handle(
    @Body() dto: CreateUserMemberRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.createUserMemberService.execute(dto);
  }
}
