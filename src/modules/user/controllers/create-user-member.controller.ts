import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CreateUserMemberRequestDTO } from '../dtos/create-user-member-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserMemberService } from '../services/create-user-member.service';

import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users/members')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
export class CreateUserMemberController {
  constructor(
    private readonly createUserMemberService: CreateUserMemberService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new member user (not ADMIN)' })
  @ApiResponse({ status: 201, type: CreateUserResponseDTO })
  @ApiConflictResponse({
    description: 'Conflict: user already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'User already exists',
        error: 'USER_ALREADY_EXISTS',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be a valid email'],
        error: 'Bad Request',
      },
    },
  })
  async handle(
    @Body() dto: CreateUserMemberRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.createUserMemberService.execute(dto);
  }
}
