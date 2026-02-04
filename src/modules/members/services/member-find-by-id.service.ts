import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO } from '../dtos';
import { MemberMapper } from '../mappers';
import { MemberRepository } from '../repositories/member.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

/**
 * Service para buscar um membro por ID com validação de acesso.
 *
 * Fluxo:
 * 1. Valida existência do membro
 * 2. Busca estabelecimentos vinculados ao membro
 * 3. Valida permissão de acesso do requester (deve ser owner de um dos estabelecimentos)
 * 4. Retorna dados do membro incluindo establishmentId do requester
 *
 * @throws {CustomHttpException} MEMBER_NOT_FOUND - Membro não existe
 * @throws {CustomHttpException} ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED - Membro sem estabelecimentos
 * @throws {CustomHttpException} ESTABLISHMENT_NOT_OWNED_BY_USER - Requester não é owner de nenhum estabelecimento do membro
 */
@Injectable()
export class MemberFindByIdService {
  private readonly logger = new Logger(MemberFindByIdService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

  /**
   * Busca um membro por ID e valida permissão de acesso.
   *
   * @param memberId - ID do membro a ser buscado
   * @param requesterId - ID do usuário fazendo a requisição (deve ser owner)
   * @returns MemberResponseDTO com dados do membro e establishmentId do requester
   *
   * @throws {CustomHttpException} MEMBER_NOT_FOUND - Se membro não existir
   * @throws {CustomHttpException} ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED - Se membro não tiver estabelecimentos
   * @throws {CustomHttpException} ESTABLISHMENT_NOT_OWNED_BY_USER - Se requester não for owner de nenhum estabelecimento do membro
   *
   * @example
   * ```typescript
   * const member = await service.execute('member-id', 'requester-id');
   * console.log(member.establishmentId); // ID do estabelecimento do requester
   * ```
   */
  async execute(
    memberId: string,
    requesterId: string,
  ): Promise<MemberResponseDTO> {
    this.logger.log(`Finding member ${memberId} by user ${requesterId}`);

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

    // Validar se requester é dono de algum estabelecimento do usuário
    const hasAccess = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!hasAccess) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    // hasAccess validation above guarantees that this find will succeed
    const establishmentId = userEstablishments.find(
      (ue) => ue.establishment.ownerId === requesterId,
    )!.establishment.id;

    this.logger.log(`Member found: ${member.id}`);

    return MemberMapper.toResponseDTO(member, true, establishmentId);
  }
}
