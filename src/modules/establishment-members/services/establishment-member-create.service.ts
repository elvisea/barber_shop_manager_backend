import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

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
  ): Promise<EstablishmentMemberCreateResponseDTO> {
    this.logger.log(
      `Creating member for establishment ${dto.establishmentId} and user ${dto.userId}`,
    );

    // Valida se o estabelecimento existe e o usuário tem permissão
    await this.establishmentAccessService.assertUserHasAccess(
      dto.establishmentId,
      dto.userId,
    );

    // Verifica se já existe membro
    const exists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        dto.userId,
        dto.establishmentId,
      );

    if (exists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
        { USER_ID: dto.userId, ESTABLISHMENT_ID: dto.establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
      );
    }

    const member = await this.establishmentMemberRepository.createMember({
      userId: dto.userId,
      establishmentId: dto.establishmentId,
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
