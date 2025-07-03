import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDTO {
  @ApiProperty({
    example: 'cm0abc123def456ghi789',
    description: 'Unique user ID'
  })
  id: string;

  @ApiProperty({
    example: 'John Silva',
    description: 'User full name'
  })
  name: string;

  @ApiProperty({
    example: 'john.silva@gmail.com',
    description: 'User email'
  })
  email: string;

  @ApiProperty({
    example: '11999999999',
    description: 'User phone number'
  })
  phone: string;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'User creation date'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'User last update date'
  })
  updatedAt: Date;
} 