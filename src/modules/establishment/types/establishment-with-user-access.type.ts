import { Establishment, UserRole } from '@prisma/client';

/**
 * Estabelecimento com vínculo do usuário (se houver) em uma única query.
 * Usado para validar acesso: owner (ownerId) ou member (userEstablishments ativo com role).
 */
export type EstablishmentWithUserAccess = Establishment & {
  userEstablishments: Array<{
    id: string;
    isActive: boolean;
    role: UserRole;
  }>;
};
