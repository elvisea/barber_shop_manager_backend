import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAuthRequestDTO {
  /**
   * The email of the user.
   */
  @ApiProperty({
    example: 'admin@bytefulcode.tech',
    description: 'The email of the user.',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   */
  @ApiProperty({
    example: 'Str0ngP@ssw0rd!',
    description: 'The password of the user.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  /**
   * The IP address of the user.
   */
  @ApiProperty({
    example: '127.0.0.1',
    description: 'The IP address of the user.',
    required: false,
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  /**
   * The user agent of the user.
   */
  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    description: 'The user agent of the user.',
    required: false,
  })
  @IsString()
  @IsOptional()
  userAgent?: string;
} 