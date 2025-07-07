import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateUserMemberRequestDTO } from '../dtos/create-user-member-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserRepository } from '../repositories/user.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class CreateUserMemberService {
  private readonly logger = new Logger(CreateUserMemberService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    userData: CreateUserMemberRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.log(
      `Starting member user creation with email: ${userData.email}`,
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

    // Generate temp password
    const tempPassword = generateTempPassword(8);

    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.warn(
        `Temporary password for ${userData.email}: ${tempPassword}`,
      );
    }

    // Hash the password
    const hashedPassword = await hashValue(tempPassword);
    this.logger.log(`User password was hashed successfully.`);

    // Prepare data for creation
    const userDataToCreate = {
      ...userData,
      password: hashedPassword,
    };

    // Create user in database
    const newUser = await this.userRepository.createUser(userDataToCreate);

    this.logger.log(`User with ID ${newUser.id} created successfully.`);

    // Send email with temp password
    await this.emailService.sendEmail(
      newUser.email,
      'Welcome! Your temporary password',
      `Hello ${newUser.name}, your account has been created. Your temporary password is: ${tempPassword}`,
    );

    // Create response DTO
    const createUserResponseDTO = UserMapper.toResponse(newUser);

    this.logger.log(
      `User creation with email ${createUserResponseDTO.email} completed successfully.`,
    );

    return createUserResponseDTO;
  }
}
