import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRefreshTokenDTO {
  /**
   * The refresh token.
   */
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  /**
   * The expiration date of the refresh token.
   */
  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;

  /**
   * The user ID.
   */
  @IsString()
  @IsNotEmpty()
  userId: string;

  /**
   * The IP address of the user.
   */
  @IsString()
  @IsOptional()
  ipAddress?: string;

  /**
   * The user agent of the user.
   */
  @IsString()
  @IsOptional()
  userAgent?: string;
}
