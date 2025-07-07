import { User } from '@prisma/client';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';

export interface IUserRepository {
  createUser(data: CreateUserRequestDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<User>;

  findByEmailWithMemberships(email: string): Promise<
    | (User & {
        memberships: Array<{
          establishmentId: string;
          role: string;
        }>;
      })
    | null
  >;
}
