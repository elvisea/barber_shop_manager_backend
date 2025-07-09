import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberCreateRequestDTO } from '../dtos/establishment-member-create-request.dto';
import { EstablishmentMemberCreateResponseDTO } from '../dtos/establishment-member-create-response.dto';
import { EstablishmentMemberRepository } from '../repositories/establishment-member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class EstablishmentMemberCreateService {
  private readonly logger = new Logger(EstablishmentMemberCreateService.name);

  constructor(
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    dto: EstablishmentMemberCreateRequestDTO,
    establishmentId: string,
    memberId: string,
    requesterId: string,
  ): Promise<EstablishmentMemberCreateResponseDTO> {
    this.logger.log(
      `Creating member for establishment ${establishmentId} and user ${memberId}`,
    );

    // Valida se o estabelecimento existe e o usuário tem permissão
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    // Verifica se já existe membro
    const exists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        memberId,
        establishmentId,
      );

    if (exists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
        { USER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
      );
    }

    const member = await this.establishmentMemberRepository.createMember({
      userId: memberId,
      establishmentId,
      role: dto.role,
    });

    return {
      userId: member.userId,
      establishmentId: member.establishmentId,
      role: member.role,
      isActive: member.isActive,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };
  }
}
