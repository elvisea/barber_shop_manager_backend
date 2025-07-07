import { User } from '@prisma/client';

import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';

export class UserMapper {
  static toResponse(user: User): CreateUserResponseDTO {
    const dto = new CreateUserResponseDTO();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.phone = user.phone;
    dto.createdAt = user.createdAt;
    dto.updatedAt = user.updatedAt;
    return dto;
  }
}
