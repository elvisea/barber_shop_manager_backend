import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserService } from '../services/create-user.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';

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
  @ApiResponse({
    status: 409,
    description: SwaggerErrorExamples.userAlreadyExists.description,
    schema: { example: SwaggerErrorExamples.userAlreadyExists.example },
  })
  @ApiResponse({
    status: 400,
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiResponse({
    status: 500,
    description: SwaggerErrorExamples.userCreationFailed.description,
    schema: { example: SwaggerErrorExamples.userCreationFailed.example },
  })
  async handle(
    @Body() dto: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.createUserService.execute(dto);
  }
}
