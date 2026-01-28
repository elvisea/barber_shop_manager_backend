import { Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';

import { IUserRepository } from '../contracts/user-repository.interface';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserRequestDTO): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        document: data.document,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  async updateEmailVerified(userId: string, verified: boolean): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { emailVerified: verified },
    });
  }

  async updateWhatsappConnection(
    userId: string,
    connected: boolean,
    phoneNumber?: string | null,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        whatsappConnected: connected,
        ...(phoneNumber !== undefined && { whatsappPhone: phoneNumber }),
      },
    });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<User> {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prismaService.user.count({
      where: { email },
    });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.prismaService.user.count({
      where: { phone },
    });
    return count > 0;
  }

  async existsByEmailExcludingId(
    email: string,
    excludeId: string,
  ): Promise<boolean> {
    const count = await this.prismaService.user.count({
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
    const count = await this.prismaService.user.count({
      where: {
        phone,
        id: { not: excludeId },
      },
    });
    return count > 0;
  }

  async updateUserFields(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: UserRole;
    }>,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async createUserForEstablishment(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    document?: string;
  }): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        document: data.document || '',
      },
    });
  }
}
