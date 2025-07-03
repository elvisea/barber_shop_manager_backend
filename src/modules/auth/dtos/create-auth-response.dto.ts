import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthResponseDTO {
  /**
   * The access token for the authenticated user.
   */
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The access token for the authenticated user.',
  })
  accessToken: string;

  /**
   * The refresh token for the authenticated user.
   */
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The refresh token for the authenticated user.',
  })
  refreshToken: string;
} 