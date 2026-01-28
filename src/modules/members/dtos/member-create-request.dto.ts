import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
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
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.BARBER,
    description: 'Role of the member',
  })
  @IsEnum(UserRole)
  role: UserRole;
}
