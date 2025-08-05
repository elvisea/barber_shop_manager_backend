import { Injectable } from '@nestjs/common';
import { User, UserEmailVerification } from '@prisma/client';

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
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findByEmailWithVerification(
    email: string,
  ): Promise<
    (User & { emailVerification: UserEmailVerification | null }) | null
  > {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        emailVerification: true,
      },
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
}
