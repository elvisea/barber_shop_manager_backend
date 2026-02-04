import { User } from '@prisma/client';

import { MemberResponseDTO } from '../dtos/member-response.dto';

/**
 * Mapper para conversão entre entidades Prisma e DTOs de Member.
 *
 * Responsabilidades:
 * - Converter User (Prisma) → MemberResponseDTO
 * - Incluir establishmentId quando fornecido (vem de UserEstablishment)
 * - Mapear arrays de usuários
 */
export class MemberMapper {
  /**
   * Converte um User do Prisma para MemberResponseDTO
   * @param user - Dados do usuário vindos do banco
   * @param _includeEstablishmentId - Reservado para uso futuro (establishmentId vem de UserEstablishment)
   * @param establishmentId - ID do estabelecimento (vindo de UserEstablishment) para incluir na resposta
   * @returns MemberResponseDTO
   */
  static toResponseDTO(
    user: User,
    _includeEstablishmentId = false,
    establishmentId?: string,
  ): MemberResponseDTO {
    const response: MemberResponseDTO = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: true, // TODO: Verificar se precisa de campo isActive em User
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (establishmentId) {
      response.establishmentId = establishmentId;
    }

    return response;
  }

  /**
   * Converte um array de Users do Prisma para array de MemberResponseDTO.
   *
   * @param users - Array de entidades User vindas do Prisma
   * @param _includeEstablishmentId - (Reservado) Flag para uso futuro de inclusão de establishmentId
   * @returns Array de MemberResponseDTO
   *
   * @remarks
   * Esta versão não inclui establishmentId. Para incluir, use `toResponseDTO` individualmente.
   *
   * @example
   * ```typescript
   * const users = await prisma.user.findMany({ where: { role: 'MEMBER' } });
   * const dtos = MemberMapper.toResponseDTOArray(users);
   * ```
   */
  static toResponseDTOArray(
    users: User[],
    _includeEstablishmentId = false,
  ): MemberResponseDTO[] {
    return users.map((user) =>
      this.toResponseDTO(user, _includeEstablishmentId),
    );
  }
}
