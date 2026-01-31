import { User, UserRole } from '@prisma/client';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';

export interface IUserRepository {
  createUser(data: CreateUserRequestDTO): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string, deletedByUserId: string): Promise<User>;
  updateEmailVerified(userId: string, verified: boolean): Promise<User>;
  updateWhatsappConnection(
    userId: string,
    connected: boolean,
    phoneNumber?: string | null,
  ): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
  existsByPhone(phone: string): Promise<boolean>;
  existsByEmailExcludingId(email: string, excludeId: string): Promise<boolean>;
  existsByPhoneExcludingId(phone: string, excludeId: string): Promise<boolean>;
  updateUserFields(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phone: string;
      role: UserRole;
    }>,
  ): Promise<User>;
  createUserForEstablishment(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    document?: string;
  }): Promise<User>;
}
