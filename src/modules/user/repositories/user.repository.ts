import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

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
}
