import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class EstablishmentMemberFindByIdResponseDTO {
  @ApiProperty({
    example: {
      id: 'uuid-user',
      name: 'John Doe',
      email: 'john@email.com',
      phone: '+5511999999999',
      emailVerified: true,
      createdAt: '2024-07-01T12:00:00.000Z',
      updatedAt: '2024-07-01T12:00:00.000Z',
    },
  })
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };

  @ApiProperty({
    example: {
      role: Role.BARBER,
      isActive: true,
      createdAt: '2024-07-01T12:00:00.000Z',
      updatedAt: '2024-07-01T12:00:00.000Z',
    },
  })
  member: {
    role: Role;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}
