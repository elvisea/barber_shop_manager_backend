import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

  async execute(userData: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    this.logger.log(
      `Starting user creation with email: ${userData.email}`,
    );

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.warn(
        `User with email ${userData.email} already exists in the system.`,
      );

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_ALREADY_EXISTS,
        { EMAIL: userData.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.CONFLICT,
        ErrorCode.USER_ALREADY_EXISTS,
      );
    }

    this.logger.log(
      `Email ${userData.email} not found. Proceeding with user creation.`,
    );

    try {
      // Hash the password
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
      this.logger.log(`User password was hashed successfully.`);

      // Prepare data for creation
      const userDataToCreate = {
        ...userData,
        password: hashedPassword,
      };

      // Create user in database
      const newUser = await this.userRepository.createUser(userDataToCreate);
      this.logger.log(`User with ID ${newUser.id} created successfully.`);

      // Send welcome email
      await this.emailService.sendEmail(
        newUser.email,
        'Welcome!',
        `Hello ${newUser.name}, your account has been created successfully!`,
      );

      // Create response DTO
      const createUserResponseDTO = this.createUserResponse(newUser);

      this.logger.log(
        `User creation with email ${createUserResponseDTO.email} completed successfully.`,
      );

      return createUserResponseDTO;
    } catch (error) {
      this.logger.error(
        `Error creating user with email ${userData.email}: ${error.message}`,
      );

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.USER_CREATION_FAILED,
        { EMAIL: userData.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.USER_CREATION_FAILED,
      );
    }
  }

  // Private function to create CreateUserResponseDTO
  private createUserResponse(user: User): CreateUserResponseDTO {
    const createUserResponseDTO = new CreateUserResponseDTO();
    createUserResponseDTO.id = user.id;
    createUserResponseDTO.name = user.name;
    createUserResponseDTO.email = user.email;
    createUserResponseDTO.phone = user.phone;
    createUserResponseDTO.createdAt = user.createdAt;
    createUserResponseDTO.updatedAt = user.updatedAt;

    return createUserResponseDTO;
  }
} 