import { ErrorCode } from '@/enums/error-code';

export const messages: Record<ErrorCode, { message: string }> = {

  [ErrorCode.USER_NOT_FOUND]: {
    message: 'User with ID [USER_ID] not found.',
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    message: 'User with email [EMAIL] already exists.',
  },

} as const;
