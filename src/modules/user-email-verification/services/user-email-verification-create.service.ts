import { Injectable, Logger } from '@nestjs/common';
import { UserEmailVerification } from '@prisma/client';

import { UserEmailVerificationRepository } from '../repositories/user-email-verification.repository';

import { generateVerificationData } from '@/utils/generate-verification-data';

@Injectable()
export class UserEmailVerificationCreateService {
  private readonly logger = new Logger(UserEmailVerificationCreateService.name);

  /**
   * Comprimento do código de verificação em dígitos.
   * Gera códigos de 6 dígitos (ex: 123456, 789012).
   */
  private static readonly VERIFICATION_CODE_LENGTH = 6;

  /**
   * Tempo de expiração da verificação em minutos.
   * 24 horas = 1440 minutos.
   */
  private static readonly EXPIRATION_MINUTES = 1440;

  constructor(
    private readonly userEmailVerificationRepository: UserEmailVerificationRepository,
  ) {}

  async execute(
    userId: string,
    email: string,
    expiresInMinutes: number = UserEmailVerificationCreateService.EXPIRATION_MINUTES,
  ): Promise<UserEmailVerification & { plainToken: string }> {
    this.logger.log(
      `Creating email verification for user ${userId} with email ${email}`,
    );

    // Generate verification data with hashed token
    const { token, hashedToken, expiresAt } = await generateVerificationData(
      expiresInMinutes,
      UserEmailVerificationCreateService.VERIFICATION_CODE_LENGTH,
    );

    // Save the hashed token to the database
    const verification =
      await this.userEmailVerificationRepository.createUserEmailVerification({
        token: hashedToken, // Save hashed version
        email,
        expiresAt,
        userId,
      });

    this.logger.log(`Email verification created with code ${token}`);

    // Return the plain token for email sending
    return {
      ...verification,
      plainToken: token, // Plain token for email
    };
  }
}
