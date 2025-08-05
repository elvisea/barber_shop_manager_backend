import { User, UserEmailVerification } from '@prisma/client';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';

export interface IUserRepository {
  createUser(data: CreateUserRequestDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithVerification(
    email: string,
  ): Promise<
    (User & { emailVerification: UserEmailVerification | null }) | null
  >;
  findById(id: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<User>;
}
