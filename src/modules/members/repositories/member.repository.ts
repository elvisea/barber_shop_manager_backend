import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Token, TokenType, User, UserRole } from '@prisma/client';

import { IMemberRepository } from '../contracts/member-repository.interface';
import { MemberRelationshipsSummaryDTO } from '../dtos/member-summary-response.dto';

import { PrismaService } from '@/prisma/prisma.service';

type MemberWithEstablishment = Prisma.UserGetPayload<{
  include: { ownedEstablishments: true };
}>;

@Injectable()
export class MemberRepository implements IMemberRepository {
  private readonly logger = new Logger(MemberRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async createMember(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    establishmentId: string;
  }): Promise<User> {
    // Criar User primeiro
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        document: '', // Campo obrigatório - pode ser preenchido posteriormente
      },
    });

    // Criar UserEstablishment
    await this.prisma.userEstablishment.create({
      data: {
        userId: user.id,
        establishmentId: data.establishmentId,
        role: data.role,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async findByIdWithEstablishment(
    id: string,
  ): Promise<MemberWithEstablishment | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: { ownedEstablishments: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async findByEmailWithVerification(
    email: string,
  ): Promise<(User & { verificationToken: Token | null }) | null> {
    const member = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!member) {
      return null;
    }

    // Buscar token de verificação usado (indicando que email foi verificado)
    const verificationToken = await this.prisma.token.findFirst({
      where: {
        userId: member.id,
        type: TokenType.EMAIL_VERIFICATION,
        used: true,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      ...member,
      verificationToken,
    };
  }

  async findByEstablishmentAndId(
    establishmentId: string,
    memberId: string,
  ): Promise<User | null> {
    // Buscar via UserEstablishment
    const userEstablishment = await this.prisma.userEstablishment.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        deletedAt: null,
      },
      include: { user: true },
    });
    return userEstablishment?.user || null;
  }

  async findByEstablishmentAndIdWithEstablishment(
    establishmentId: string,
    memberId: string,
  ): Promise<MemberWithEstablishment | null> {
    const userEstablishment = await this.prisma.userEstablishment.findFirst({
      where: {
        userId: memberId,
        establishmentId,
        deletedAt: null,
      },
      include: { user: { include: { ownedEstablishments: true } } },
    });
    return userEstablishment?.user || null;
  }

  async findByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) return null;

    const userEstablishment = await this.prisma.userEstablishment.findFirst({
      where: {
        userId: user.id,
        establishmentId,
        deletedAt: null,
      },
    });
    return userEstablishment ? user : null;
  }

  async findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: User[];
    total: number;
  }> {
    const [userEstablishments, total] = await Promise.all([
      this.prisma.userEstablishment.findMany({
        where: { establishmentId, deletedAt: null },
        skip,
        take,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.userEstablishment.count({
        where: { establishmentId, deletedAt: null },
      }),
    ]);
    return {
      data: userEstablishments.map((ue) => ue.user),
      total,
    };
  }

  async updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteMember(id: string, deletedByUserId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: deletedByUserId,
      },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email, deletedAt: null },
    });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { phone, deletedAt: null },
    });
    return count > 0;
  }

  async existsByEmailExcludingId(
    email: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email,
        id: { not: excludeId },
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsByPhoneExcludingId(
    phone: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        phone,
        id: { not: excludeId },
        deletedAt: null,
      },
    });
    return count > 0;
  }

  // Métodos legados mantidos para compatibilidade
  async existsByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) return false;
    const count = await this.prisma.userEstablishment.count({
      where: { userId: user.id, establishmentId, deletedAt: null },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishment(
    phone: string,
    establishmentId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
    });
    if (!user) return false;
    const count = await this.prisma.userEstablishment.count({
      where: { userId: user.id, establishmentId, deletedAt: null },
    });
    return count > 0;
  }

  async existsByEmailAndEstablishmentExcludingId(
    email: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user || user.id === excludeId) return false;
    const count = await this.prisma.userEstablishment.count({
      where: {
        userId: user.id,
        establishmentId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishmentExcludingId(
    phone: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { phone, deletedAt: null },
    });
    if (!user || user.id === excludeId) return false;
    const count = await this.prisma.userEstablishment.count({
      where: {
        userId: user.id,
        establishmentId,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async getMemberSummary(
    memberId: string,
    establishmentId: string,
  ): Promise<MemberRelationshipsSummaryDTO> {
    this.logger.debug(
      `Fetching member summary for member ${memberId} in establishment ${establishmentId}`,
    );

    const [
      servicesCount,
      productsCount,
      workingHoursCount,
      absencePeriodsCount,
    ] = await Promise.all([
      this.prisma.userService.count({
        where: {
          userId: memberId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.userProduct.count({
        where: {
          userId: memberId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.userWorkingHours.count({
        where: {
          userId: memberId,
          deletedAt: null,
        },
      }),
      this.prisma.userAbsencePeriod.count({
        where: {
          userId: memberId,
          deletedAt: null,
        },
      }),
    ]);

    this.logger.debug(
      `Summary retrieved: ${servicesCount} services, ${productsCount} products, ${workingHoursCount} working hours, ${absencePeriodsCount} absence periods`,
    );

    return {
      services: { total: servicesCount },
      products: { total: productsCount },
      workingHours: { total: workingHoursCount },
      absencePeriods: { total: absencePeriodsCount },
    };
  }
}
