import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { getCurrentDate } from '@/common/utils/date-helpers';

export class CreateUserResponseDTO {
  @ApiProperty({
    example: 'cm0abc123def456ghi789',
    description: 'Unique user ID',
  })
  id: string;

  @ApiProperty({
    example: 'John Silva',
    description: 'User full name',
  })
  name: string;

  @ApiProperty({
    example: 'john.silva@gmail.com',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: '+5511999999999',
    description: 'User phone number',
  })
  phone: string;

  @ApiProperty({
    example: UserRole.OWNER,
    enum: UserRole,
    description: 'User role',
  })
  role: UserRole;

  @ApiProperty({
    example: false,
    description: 'Email verification status',
  })
  emailVerified: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether the user is fake/fictional (for testing purposes)',
  })
  isFake: boolean;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'User creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: getCurrentDate(),
    description: 'User last update date',
  })
  updatedAt: Date;
}
