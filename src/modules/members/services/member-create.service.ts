import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MemberCreateRequestDTO, MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { handleServiceError } from '@/common/utils';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { MemberCreatedEvent } from '@/modules/emails/events/member-created.event';
import { MemberVerificationTokenSentEvent } from '@/modules/emails/events/member-verification-token-sent.event';
import { EstablishmentOwnerAccessService } from '@/modules/establishment/services/establishment-owner-access.service';
import { MemberEmailVerificationCreateService } from '@/modules/member-email-verification/services/member-email-verification-create.service';
import { generateTempPassword } from '@/utils/generate-temp-password';
import { hashValue } from '@/utils/hash-value';

@Injectable()
export class MemberCreateService {
  private readonly logger = new Logger(MemberCreateService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
    private readonly memberEmailVerificationCreateService: MemberEmailVerificationCreateService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    dto: MemberCreateRequestDTO,
    establishmentId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(
      `Creating member for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Verifica se já existe membro com este email globalmente
    const emailExists = await this.memberRepository.existsByEmail(dto.email);

    if (emailExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
        { EMAIL: dto.email },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
      );
    }

    // 3. Verifica se já existe membro com este telefone globalmente
    const phoneExists = await this.memberRepository.existsByPhone(dto.phone);

    if (phoneExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
        { PHONE: dto.phone },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
      );
    }

    // 4. Gera senha temporária e faz hash
    const tempPassword = generateTempPassword(8);
    const hashedPassword = await hashValue(tempPassword);

    // 5. Cria o membro
    try {
      const member = await this.memberRepository.createMember({
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        establishmentId,
      });

      this.logger.log(`Member created with ID: ${member.id}`);

      // Emitir evento de membro criado
      const memberCreatedEvent = new MemberCreatedEvent({
        memberId: member.id,
        email: member.email,
        name: member.name,
        tempPassword,
      });
      this.eventEmitter.emit('member.created', memberCreatedEvent);

      // 6. Cria verificação de email e envia código
      try {
        const verification =
          await this.memberEmailVerificationCreateService.execute(
            member.id,
            dto.email,
          );

        // Formatar data de expiração no formato brasileiro
        const expiresAtFormatted = verification.expiresAt.toLocaleString(
          'pt-BR',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'America/Sao_Paulo',
          },
        );

        // Emitir evento de token de verificação enviado
        const verificationTokenSentEvent = new MemberVerificationTokenSentEvent(
          {
            memberId: member.id,
            email: member.email,
            name: member.name,
            token: verification.plainToken,
            expiresAt: expiresAtFormatted,
            tempPassword,
          },
        );
        this.eventEmitter.emit(
          'member.verification.token.sent',
          verificationTokenSentEvent,
        );

        this.logger.log(
          `Verification token event emitted for member: ${member.id}`,
        );
      } catch (emailError: unknown) {
        this.logger.error(
          `Failed to create verification for member ${member.id}`,
          {
            error:
              emailError instanceof Error
                ? emailError.message
                : String(emailError),
          },
        );
        // Don't throw error here, just log it
        // The member was still created successfully
      }

      return MemberMapper.toResponseDTO(member, false);
    } catch (error: unknown) {
      handleServiceError({
        error,
        logger: this.logger,
        errorMessageService: this.errorMessageService,
        errorCode: ErrorCode.MEMBER_CREATION_FAILED,
        httpStatus: HttpStatus.BAD_REQUEST,
        logMessage: 'Failed to create member',
        logContext: {
          email: dto.email,
          establishmentId,
        },
        errorParams: {
          EMAIL: dto.email,
          ESTABLISHMENT_ID: establishmentId,
        },
      });
    }
  }
}
