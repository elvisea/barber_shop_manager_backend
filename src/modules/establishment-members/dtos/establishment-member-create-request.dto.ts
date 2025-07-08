import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class EstablishmentMemberCreateRequestDTO {
  @ApiProperty({ example: 'uuid-user', description: 'User ID' })
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: Role,
    example: Role.BARBER,
    description: 'Role of the member',
  })
  @IsEnum(Role)
  role: Role;
}
