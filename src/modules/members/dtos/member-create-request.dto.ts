import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class MemberCreateRequestDTO {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@barbearia.com' })
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    enum: Role,
    example: Role.BARBER,
    description: 'Role of the member',
  })
  @IsEnum(Role)
  role: Role;
}
