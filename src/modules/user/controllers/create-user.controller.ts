import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserService } from '../services/create-user.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDTO,
  })
  @ApiConflictResponse({
    description: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].description,
    schema: { example: SwaggerErrors[ErrorCode.USER_ALREADY_EXISTS].example },
  })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiResponse({
    status: 500,
    description: SwaggerErrors[ErrorCode.USER_CREATION_FAILED].description,
    schema: { example: SwaggerErrors[ErrorCode.USER_CREATION_FAILED].example },
  })
  async handle(
    @Body() dto: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.createUserService.execute(dto);
  }
}
