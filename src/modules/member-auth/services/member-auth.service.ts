import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { MemberAuthRequestDTO } from '../dtos/member-auth-request.dto';
import { MemberAuthResponseDTO } from '../dtos/member-auth-response.dto';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberRefreshTokenRepository } from '@/modules/member-auth/repositories/member-refresh-token.repository';
import { MemberEmailVerificationResendService } from '@/modules/member-email-verification/services/member-email-verification-resend.service';
import { MemberRepository } from '@/modules/members/repositories/member.repository';
import { TokenService } from '@/shared/token/token.service';

@Injectable()
export class MemberAuthService {
  private readonly logger = new Logger(MemberAuthService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly memberRefreshTokenRepository: MemberRefreshTokenRepository,
    private readonly tokenService: TokenService,
    private readonly errorMessageService: ErrorMessageService,
    private readonly memberEmailVerificationResendService: MemberEmailVerificationResendService,
  ) {}

  async execute(
    authRequest: MemberAuthRequestDTO,
  ): Promise<MemberAuthResponseDTO> {
    this.logger.log(
      `Starting member authentication process for email: ${authRequest.email}`,
    );

    const memberWithVerification =
      await this.memberRepository.findByEmailWithVerification(
        authRequest.email,
      );

    /**
     * The member is not found.
     */
    if (!memberWithVerification) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
        { EMAIL: authRequest.email },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
      );
    }

    /**
     * Check if member is active.
     */
    if (!memberWithVerification.isActive) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: memberWithVerification.id },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    const isPasswordValid = await compare(
      authRequest.password,
      memberWithVerification.password,
    );

    /**
     * The password is invalid.
     */
    if (!isPasswordValid) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
        { EMAIL: authRequest.email },
      );
      this.logger.warn(errorMessage);
      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.INVALID_EMAIL_OR_PASSWORD,
      );
    }

    /**
     * Check if email is verified.
     */
    if (!memberWithVerification.emailVerification?.verified) {
      this.logger.warn(
        `Email not verified for member: ${memberWithVerification.id}`,
      );

      // Re-send verification email
      try {
        await this.memberEmailVerificationResendService.execute(
          authRequest.email,
        );
        this.logger.log(`Verification email re-sent for: ${authRequest.email}`);
      } catch (resendError) {
        this.logger.error(
          `Failed to re-send verification email: ${resendError.message}`,
        );
        // Don't throw error here, just log it
      }

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.EMAIL_NOT_VERIFIED,
        { EMAIL: authRequest.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.UNAUTHORIZED,
        ErrorCode.EMAIL_NOT_VERIFIED,
      );
    }

    this.logger.log(
      `Member authentication successful for email [${authRequest.email}] in establishment [${memberWithVerification.establishmentId}].`,
    );

    const payload = { sub: memberWithVerification.id };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.memberRefreshTokenRepository.create({
      refreshToken,
      expiresAt,
      memberId: memberWithVerification.id,
      ipAddress: authRequest.ipAddress,
      userAgent: authRequest.userAgent,
    });

    this.logger.log(
      `Member tokens generated successfully. Sending auth response.`,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
