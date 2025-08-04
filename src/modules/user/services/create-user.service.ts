import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { hashValue } from '../../../utils/hash-value';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { UserMapper } from '../mappers/user.mapper';
import { UserRepository } from '../repositories/user.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEmailVerificationCreateService } from '@/modules/user-email-verification/services/user-email-verification-create.service';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  /**
   * Tempo de expiração da verificação de email em minutos.
   * 24 horas = 1440 minutos.
   */
  private static readonly EMAIL_VERIFICATION_EXPIRATION_MINUTES = 1440;

  constructor(
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEmailVerificationCreateService: UserEmailVerificationCreateService,
  ) {}

  async execute(
    userData: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    this.logger.log(`Starting user creation with email: ${userData.email}`);

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
      const hashedPassword = await hashValue(userData.password);
      this.logger.log(`User password was hashed successfully.`);

      // Prepare data for creation
      const userDataToCreate = {
        ...userData,
        password: hashedPassword,
      };

      // Create user in database
      const newUser = await this.userRepository.createUser(userDataToCreate);
      this.logger.log(`User with ID ${newUser.id} created successfully.`);

      // Create email verification
      const emailVerification =
        await this.userEmailVerificationCreateService.execute(
          newUser.id,
          newUser.email,
          CreateUserService.EMAIL_VERIFICATION_EXPIRATION_MINUTES,
        );

      this.logger.log(`Email verification created for user ${newUser.id}`);

      // Send welcome email with verification code
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?code=${emailVerification.plainToken}`;

      await this.emailService.sendEmail(
        newUser.email,
        'Welcome! Please verify your email',
        `Hello ${newUser.name}, your account has been created successfully! Please use the verification code: ${emailVerification.plainToken} or click the link: ${verificationUrl}`,
      );

      // Create response DTO
      const createUserResponseDTO = UserMapper.toResponse(newUser);

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
}
