import { ErrorCode } from '@/enums/error-code';

export const messages: Record<ErrorCode, { message: string }> = {

  [ErrorCode.USER_NOT_FOUND]: {
    message: 'User with ID [USER_ID] not found.',
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    message: 'User with email [EMAIL] already exists.',
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED]: {
    message: 'The email [EMAIL] is already registered and verified.',
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS_NOT_VERIFIED]: {
    message: 'The email [EMAIL] is already registered but not verified.',
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    message: 'Invalid email or password.',
  },
  [ErrorCode.USER_CREATION_FAILED]: {
    message: 'Failed to create user with email [EMAIL].',
  },
  [ErrorCode.INVALID_EMAIL_OR_PASSWORD]: {
    message: 'Invalid email or password for email [EMAIL].',
  },
  [ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS]: {
    message: 'Establishment with phone [PHONE] already exists for user [USER_ID].',
  },
} as const;
