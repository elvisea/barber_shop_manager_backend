import { Injectable, Logger } from '@nestjs/common';
import { MemberEmailVerification } from '@prisma/client';

import { MemberEmailVerificationRepository } from '../repositories/member-email-verification.repository';

import { generateVerificationData } from '@/utils/generate-verification-data';

@Injectable()
export class MemberEmailVerificationCreateService {
  private readonly logger = new Logger(
    MemberEmailVerificationCreateService.name,
  );

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
    private readonly memberEmailVerificationRepository: MemberEmailVerificationRepository,
  ) { }

  async execute(
    memberId: string,
    email: string,
    expiresInMinutes: number = MemberEmailVerificationCreateService.EXPIRATION_MINUTES,
  ): Promise<MemberEmailVerification & { plainToken: string }> {
    this.logger.log(
      `Creating email verification for member ${memberId} with email ${email}`,
    );

    // Generate verification data with hashed token
    const { token, hashedToken, expiresAt } = await generateVerificationData(
      expiresInMinutes,
      MemberEmailVerificationCreateService.VERIFICATION_CODE_LENGTH,
    );

    // Save the hashed token to the database
    const verification =
      await this.memberEmailVerificationRepository.createMemberEmailVerification(
        {
          token: hashedToken, // Save hashed version
          email,
          expiresAt,
          memberId,
        },
      );

    this.logger.log(`Email verification created with code ${token}`);

    // Return the plain token for email sending
    return {
      ...verification,
      plainToken: token, // Plain token for email
    };
  }
}
