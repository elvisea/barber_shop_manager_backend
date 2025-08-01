import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcryptjs';

import { MemberAuthRequestDTO } from '../dtos/member-auth-request.dto';
import { MemberAuthResponseDTO } from '../dtos/member-auth-response.dto';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberRefreshTokenRepository } from '@/modules/member-auth/repositories/member-refresh-token.repository';
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
  ) {}

  async execute(
    authRequest: MemberAuthRequestDTO,
  ): Promise<MemberAuthResponseDTO> {
    this.logger.log(
      `Starting member authentication process for email: ${authRequest.email}`,
    );

    const member = await this.memberRepository.findByEmail(authRequest.email);

    /**
     * The member is not found.
     */
    if (!member) {
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
    if (!member.isActive) {
      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: member.id },
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
      member.password,
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

    this.logger.log(
      `Member authentication successful for email [${authRequest.email}] in establishment [${member.establishmentId}].`,
    );

    const payload = { sub: member.id };

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.memberRefreshTokenRepository.create({
      refreshToken,
      expiresAt,
      memberId: member.id,
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
