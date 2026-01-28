import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberSummaryResponseDTO } from '../dtos/member-summary-response.dto';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

@Injectable()
export class MemberSummaryService {
  private readonly logger = new Logger(MemberSummaryService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    memberId: string,
    requesterId: string,
  ): Promise<MemberSummaryResponseDTO> {
    this.logger.log(
      `Getting summary for member ${memberId} by user ${requesterId}`,
    );

    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: memberId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // Buscar UserEstablishments do usuário com estabelecimentos incluídos
    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(
        memberId,
      );

    if (userEstablishments.length === 0) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: memberId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    // Por enquanto, usar o primeiro estabelecimento ativo (TODO: passar establishmentId como parâmetro)
    const userEstablishment =
      userEstablishments.find((ue) => ue.isActive) || userEstablishments[0];
    if (!userEstablishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: memberId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }
    const establishmentId = userEstablishment.establishmentId;

    // Validar se requester é dono de algum estabelecimento do usuário
    const hasAccess = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!hasAccess) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    const relationships = await this.memberRepository.getMemberSummary(
      memberId,
      establishmentId,
    );

    this.logger.log(
      `Summary retrieved for member ${memberId}: ${relationships.services.total} services, ${relationships.products.total} products, ${relationships.workingHours.total} working hours, ${relationships.absencePeriods.total} absence periods`,
    );

    return {
      member: MemberMapper.toResponseDTO(member, false),
      relationships,
    };
  }
}
