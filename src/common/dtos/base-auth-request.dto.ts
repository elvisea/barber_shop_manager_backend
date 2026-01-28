import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BaseAuthRequestDTO {
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
}
