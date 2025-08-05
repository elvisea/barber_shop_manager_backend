import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberEmailVerificationRepository } from '../repositories/member-email-verification.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { verifyCode } from '@/utils/verify-code';

@Injectable()
export class MemberEmailVerificationVerifyService {
  private readonly logger = new Logger(
    MemberEmailVerificationVerifyService.name,
  );

  constructor(
    private readonly memberEmailVerificationRepository: MemberEmailVerificationRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(email: string, code: string) {
    this.logger.log(`Verifying member email: ${email} with code: ${code}`);

    // Find verification by email
    const verification =
      await this.memberEmailVerificationRepository.findByEmail(email);

    if (!verification) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { TOKEN: code },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    // Check if token is expired
    if (verification.expiresAt < new Date()) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.VERIFICATION_TOKEN_EXPIRED,
        { TOKEN: code },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.VERIFICATION_TOKEN_EXPIRED,
      );
    }

    // Check if already verified
    if (verification.verified) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_ALREADY_VERIFIED,
        { USER_ID: verification.memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.EMAIL_ALREADY_VERIFIED,
      );
    }

    // Verify the code against the hashed token
    const isValid = await verifyCode(code, verification.token);

    if (!isValid) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { TOKEN: code },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    // Mark as verified
    const updatedVerification =
      await this.memberEmailVerificationRepository.updateVerification(
        verification.id,
        { verified: true },
      );

    this.logger.log(
      `Member email verified successfully for member: ${verification.memberId}`,
    );

    return updatedVerification;
  }
}
