import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberFindAllQueryDTO, MemberPaginatedResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';

@Injectable()
export class MemberFindAllService {
  private readonly logger = new Logger(MemberFindAllService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    establishmentId: string,
    requesterId: string,
    query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    this.logger.log(
      `Finding all members for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Verifica se o estabelecimento existe e o usuário é o dono
    const establishment =
      await this.establishmentRepository.findById(establishmentId);

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    if (establishment.ownerId !== requesterId) {
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

    // 2. Calcula paginação
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // 3. Busca membros paginados
    const { data, total } =
      await this.memberRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip,
        take: limit,
      });

    // 4. Mapeia dados para resposta
    const members = MemberMapper.toResponseDTOArray(data, false);

    this.logger.log(`Found ${members.length} members out of ${total} total`);

    // 5. Retorna resposta paginada com metadados calculados automaticamente
    return new MemberPaginatedResponseDTO(members, page, limit, total);
  }
}
