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
    message:
      'Establishment with phone [PHONE] already exists for user [USER_ID].',
  },
  [ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]: {
    message:
      'Establishment with ID [ESTABLISHMENT_ID] not found or access denied for user [USER_ID].',
  },
  [ErrorCode.INSUFFICIENT_ROLE]: {
    message:
      'User [USER_ID] does not have the required role [ROLE] for establishment [ESTABLISHMENT_ID].',
  },
} as const;
