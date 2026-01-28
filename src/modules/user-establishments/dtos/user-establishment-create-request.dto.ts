import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class UserEstablishmentCreateRequestDTO {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID do estabelecimento',
  })
  @IsUUID()
  @IsNotEmpty()
  establishmentId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'ID do usuário',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.BARBER,
    description: 'Papel do usuário no estabelecimento',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
