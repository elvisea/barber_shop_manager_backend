import { Prisma } from '@prisma/client';

/**
 * Tipo que representa um Membro com seus serviÃ§os associados.
 * Utilizado para o endpoint de listagem de profissionais com serviÃ§os.
 *
 * @see Prisma.UserGetPayload
 */
export type MemberWithServices = Prisma.UserGetPayload<{
  include: {
    userServices: {
      include: {
        service: true;
      };
    };
  };
}>;
