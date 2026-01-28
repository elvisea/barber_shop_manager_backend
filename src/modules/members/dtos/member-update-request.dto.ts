import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class MemberUpdateRequestDTO {
  @ApiPropertyOptional({ example: 'João da Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'joao@barbearia.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase())
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.BARBER,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
