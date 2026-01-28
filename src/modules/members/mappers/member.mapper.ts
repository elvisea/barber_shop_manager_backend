import { User } from '@prisma/client';

import { MemberResponseDTO } from '../dtos/member-response.dto';

export class MemberMapper {
  /**
   * Converte um User do Prisma para MemberResponseDTO
   * @param user - Dados do usuário vindos do banco
   * @param _includeEstablishmentId - Reservado para uso futuro (establishmentId vem de UserEstablishment)
   * @returns MemberResponseDTO
   */
  static toResponseDTO(
    user: User,
    _includeEstablishmentId = false,
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

    // establishmentId não está mais em User, precisa vir de UserEstablishment
    // if (includeEstablishmentId) {
    //   response.establishmentId = user.establishmentId;
    // }

    return response;
  }

  /**
   * Converte um array de Users do Prisma para array de MemberResponseDTO
   * @param users - Array de dados dos usuários vindos do banco
   * @param _includeEstablishmentId - Reservado para uso futuro (establishmentId vem de UserEstablishment)
   * @returns Array de MemberResponseDTO
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
