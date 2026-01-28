import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

/**
 * Swagger documentation for POST /refresh — exchange refresh token for new tokens.
 * Response is only accessToken and refreshToken (no user object).
 */
export function RefreshDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh tokens',
      description:
        'Exchange a valid refresh token for new access and refresh tokens. The previous refresh token is revoked (rotation).',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'New tokens issued successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              accessToken: {
                type: 'string',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'The access token for the authenticated user.',
              },
              refreshToken: {
                type: 'string',
                example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
                description: 'The refresh token for the authenticated user.',
              },
            },
            required: ['accessToken', 'refreshToken'],
          },
          example: {
            accessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: SwaggerErrors[ErrorCode.REFRESH_TOKEN_INVALID].description,
      schema: {
        example: SwaggerErrors[ErrorCode.REFRESH_TOKEN_INVALID].example,
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
      schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
    }),
  );
}
