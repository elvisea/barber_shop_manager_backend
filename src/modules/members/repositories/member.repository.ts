import { Injectable, Logger } from '@nestjs/common';
import { Member, MemberRole, Prisma, Token, TokenType } from '@prisma/client';

import { IMemberRepository } from '../contracts/member-repository.interface';
import { MemberRelationshipsSummaryDTO } from '../dtos/member-summary-response.dto';

import { PrismaService } from '@/prisma/prisma.service';

type MemberWithEstablishment = Prisma.MemberGetPayload<{
  include: { establishment: true };
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
    role: MemberRole;
    establishmentId: string;
  }): Promise<Member> {
    return this.prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        establishmentId: data.establishmentId,
      },
    });
  }

  async findById(id: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { id },
    });
  }

  async findByIdWithEstablishment(
    id: string,
  ): Promise<MemberWithEstablishment | null> {
    return this.prisma.member.findUnique({
      where: { id },
      include: { establishment: true },
    });
  }

  async findByEmail(email: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { email },
    });
  }

  async findByEmailWithVerification(
    email: string,
  ): Promise<(Member & { verificationToken: Token | null }) | null> {
    const member = await this.prisma.member.findUnique({
      where: { email },
    });

    if (!member) {
      return null;
    }

    // Buscar token de verificação usado (indicando que email foi verificado)
    const verificationToken = await this.prisma.token.findFirst({
      where: {
        memberId: member.id,
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
  ): Promise<Member | null> {
    return this.prisma.member.findFirst({
      where: {
        id: memberId,
        establishmentId,
      },
    });
  }

  async findByEstablishmentAndIdWithEstablishment(
    establishmentId: string,
    memberId: string,
  ): Promise<MemberWithEstablishment | null> {
    return this.prisma.member.findFirst({
      where: {
        id: memberId,
        establishmentId,
      },
      include: { establishment: true },
    });
  }

  async findByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<Member | null> {
    return this.prisma.member.findFirst({
      where: {
        email,
        establishmentId,
      },
    });
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
    data: Member[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.prisma.member.findMany({
        where: { establishmentId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.member.count({ where: { establishmentId } }),
    ]);
    return { data, total };
  }

  async updateMember(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: MemberRole;
      isActive: boolean;
    }>,
  ): Promise<Member> {
    return this.prisma.member.update({
      where: { id },
      data,
    });
  }

  async deleteMember(id: string): Promise<void> {
    await this.prisma.member.delete({
      where: { id },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { phone },
    });
    return count > 0;
  }

  async existsByEmailExcludingId(
    email: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        email,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }

  async existsByPhoneExcludingId(
    phone: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        phone,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }

  // Métodos legados mantidos para compatibilidade
  async existsByEmailAndEstablishment(
    email: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { email, establishmentId },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishment(
    phone: string,
    establishmentId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: { phone, establishmentId },
    });
    return count > 0;
  }

  async existsByEmailAndEstablishmentExcludingId(
    email: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        email,
        establishmentId,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }

  async existsByPhoneAndEstablishmentExcludingId(
    phone: string,
    establishmentId: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prisma.member.count({
      where: {
        phone,
        establishmentId,
        id: { not: excludeId },
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
      this.prisma.memberService.count({
        where: {
          memberId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.memberProduct.count({
        where: {
          memberId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.memberWorkingHours.count({
        where: {
          memberId,
          deletedAt: null,
        },
      }),
      this.prisma.memberAbsencePeriod.count({
        where: {
          memberId,
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
