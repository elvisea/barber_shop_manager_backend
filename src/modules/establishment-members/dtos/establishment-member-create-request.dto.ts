import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class EstablishmentMemberCreateRequestDTO {
  @ApiProperty({
    enum: Role,
    example: Role.BARBER,
    description: 'Role of the member',
  })
  @IsEnum(Role)
  role: Role;
}
