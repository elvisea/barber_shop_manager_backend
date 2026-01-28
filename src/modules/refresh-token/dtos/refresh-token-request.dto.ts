import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Request body for POST /refresh — exchange a valid refresh token for new tokens.
 */
export class RefreshTokenRequestDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The refresh token obtained from login.',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
