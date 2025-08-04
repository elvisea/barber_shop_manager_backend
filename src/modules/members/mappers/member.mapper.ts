import { Member } from '@prisma/client';

import { MemberResponseDTO } from '../dtos/member-response.dto';

export class MemberMapper {
  /**
   * Converte um Member do Prisma para MemberResponseDTO
   * @param member - Dados do membro vindos do banco
   * @param includeEstablishmentId - Se deve incluir o establishmentId na resposta
   * @returns MemberResponseDTO
   */
  static toResponseDTO(
    member: Member,
    includeEstablishmentId = false,
  ): MemberResponseDTO {
    const response: MemberResponseDTO = {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      isActive: member.isActive,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    if (includeEstablishmentId) {
      response.establishmentId = member.establishmentId;
    }

    return response;
  }

  /**
   * Converte um array de Members do Prisma para array de MemberResponseDTO
   * @param members - Array de dados dos membros vindos do banco
   * @param includeEstablishmentId - Se deve incluir o establishmentId na resposta
   * @returns Array de MemberResponseDTO
   */
  static toResponseDTOArray(
    members: Member[],
    includeEstablishmentId = false,
  ): MemberResponseDTO[] {
    return members.map((member) =>
      this.toResponseDTO(member, includeEstablishmentId),
    );
  }
}
