import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MemberEmailVerification } from '@prisma/client';

import { MemberEmailVerificationRepository } from '../repositories/member-email-verification.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { getErrorMessage } from '@/common/utils';
import { EmailService } from '@/email/email.service';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { generateVerificationData } from '@/utils/generate-verification-data';

@Injectable()
export class MemberEmailVerificationResendService {
  private readonly logger = new Logger(
    MemberEmailVerificationResendService.name,
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
    private readonly errorMessageService: ErrorMessageService,
    private readonly emailService: EmailService,
  ) {}

  async execute(
    email: string,
    expiresInMinutes: number = MemberEmailVerificationResendService.EXPIRATION_MINUTES,
  ): Promise<MemberEmailVerification & { plainToken: string }> {
    this.logger.log(`Resending member email verification for: ${email}`);

    // Find existing verification by email
    const existingVerification =
      await this.memberEmailVerificationRepository.findByEmail(email);

    if (!existingVerification) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND,
        { EMAIL: email },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND,
      );
    }

    // Check if already verified
    if (existingVerification.verified) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        { USER_ID: existingVerification.memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_VERIFIED,
      );
    }

    // Generate new verification data with hashed token
    const { token, hashedToken, expiresAt } = await generateVerificationData(
      expiresInMinutes,
      MemberEmailVerificationResendService.VERIFICATION_CODE_LENGTH,
    );

    // Update the existing verification with new token and expiration
    const updatedVerification =
      await this.memberEmailVerificationRepository.updateTokenAndExpiration(
        existingVerification.id,
        {
          token: hashedToken, // Save hashed version
          expiresAt,
        },
      );

    this.logger.log(
      `Member email verification resent with new code for member: ${existingVerification.memberId}`,
    );

    // Send email with new verification code
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-member-email?code=${token}`;

      await this.emailService.sendEmail(
        email,
        'Novo código de verificação de email - Membro',
        `Seu novo código de verificação é: ${token}\n\nOu clique no link: ${verificationUrl}\n\nEste código expira em ${expiresInMinutes / 60} horas.`,
      );

      this.logger.log(
        `Member verification email sent successfully to: ${email}`,
      );
    } catch (emailError: unknown) {
      const errorMessage = getErrorMessage(emailError);
      this.logger.error(
        `Failed to send member verification email to ${email}: ${errorMessage}`,
      );

      // Don't throw error here, just log it
      // The verification was still created successfully
    }

    // Return the updated verification with plain token for email sending
    return {
      ...updatedVerification,
      plainToken: token, // Plain token for email
    };
  }
}
