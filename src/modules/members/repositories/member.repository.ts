import { Injectable } from '@nestjs/common';
import { Member, MemberEmailVerification, MemberRole } from '@prisma/client';

import { IMemberRepository } from '../contracts/member-repository.interface';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MemberRepository implements IMemberRepository {
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

  async findByEmail(email: string): Promise<Member | null> {
    return this.prisma.member.findUnique({
      where: { email },
    });
  }

  async findByEmailWithVerification(
    email: string,
  ): Promise<
    (Member & { emailVerification: MemberEmailVerification | null }) | null
  > {
    return this.prisma.member.findUnique({
      where: { email },
      include: {
        emailVerification: true,
      },
    });
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
}
