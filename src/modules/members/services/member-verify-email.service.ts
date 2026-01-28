import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TokenType } from '@prisma/client';

import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { TokenValidationService } from '@/modules/tokens/services/token-validation.service';

export interface MemberVerifyEmailRequest {
  email: string;
  token: string;
}

export interface MemberVerifyEmailResponse {
  success: boolean;
  message: string;
}

@Injectable()
export class MemberVerifyEmailService {
  private readonly logger = new Logger(MemberVerifyEmailService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly tokenValidationService: TokenValidationService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    request: MemberVerifyEmailRequest,
  ): Promise<MemberVerifyEmailResponse> {
    this.logger.debug('Starting member email verification process', {
      email: request.email,
    });

    // Buscar member por email
    const member = await this.memberRepository.findByEmail(request.email);

    if (!member) {
      this.logger.warn('Member not found', {
        email: request.email,
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { EMAIL: request.email },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // Obter token record e validar
    const tokenRecord = await this.tokenValidationService.getTokenRecord(
      request.token,
      member.id,
      TokenType.EMAIL_VERIFICATION,
    );

    if (!tokenRecord) {
      this.logger.warn('Invalid or expired token', {
        memberId: member.id,
        email: request.email,
      });

      const errorMessage = this.errorMessageService.getMessage(
        ErrorCode.INVALID_VERIFICATION_TOKEN,
        { TOKEN: request.token },
      );

      throw new CustomHttpException(
        errorMessage,
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_VERIFICATION_TOKEN,
      );
    }

    // Marcar token como usado
    await this.tokenValidationService.markTokenAsUsed(tokenRecord.id);

    // Nota: Member não tem campo emailVerified como User
    // A verificação é feita através da existência de tokens válidos
    // Se necessário, podemos adicionar campo emailVerified no Member no futuro

    this.logger.log('Member email verified successfully', {
      memberId: member.id,
      email: request.email,
    });

    return {
      success: true,
      message: 'Email verificado com sucesso!',
    };
  }
}
