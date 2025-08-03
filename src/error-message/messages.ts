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
  [ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]: {
    message:
      'A service with name [NAME] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND]: {
    message:
      'Service with ID [SERVICE_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]: {
    message:
      'A product with name [NAME] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND]: {
    message:
      'Product with ID [PRODUCT_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS]: {
    message:
      'A customer with email [EMAIL] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS]: {
    message:
      'A customer with phone [PHONE] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND]: {
    message:
      'Customer with ID [CUSTOMER_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT]: {
    message: 'User is not active in any establishment.',
  },
  [ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT]: {
    message: 'User does not have the required role in any establishment.',
  },
  [ErrorCode.ESTABLISHMENT_NOT_FOUND]: {
    message: 'Establishment with ID [ESTABLISHMENT_ID] not found.',
  },
  [ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER]: {
    message:
      'Establishment with ID [ESTABLISHMENT_ID] does not belong to user [USER_ID].',
  },
  [ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT]: {
    message: 'User [USER_ID] is not ADMIN in establishment [ESTABLISHMENT_ID].',
  },
  ESTABLISHMENT_MEMBER_ALREADY_EXISTS: {
    message:
      'Member with USER_ID [USER_ID] is already registered in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.VALIDATION_ERROR]: {
    message: 'Validation failed for one or more fields.',
  },
  [ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND]: {
    message:
      'Member with USER_ID [USER_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT]: {
    message:
      'User [USER_ID] is not a member of establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS]: {
    message:
      'Product with PRODUCT_ID [PRODUCT_ID] is already assigned to member [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS]: {
    message:
      'Service with SERVICE_ID [SERVICE_ID] is already assigned to member [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.PLAN_NOT_FOUND]: {
    message: 'Plan with ID [PLAN_ID] not found.',
  },

  // Novos códigos para Members
  [ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS]: {
    message:
      'A member with email [EMAIL] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_PHONE_ALREADY_EXISTS]: {
    message:
      'A member with phone [PHONE] already exists in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_NOT_FOUND]: {
    message:
      'Member with ID [MEMBER_ID] not found in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_CREATION_FAILED]: {
    message:
      'Failed to create member with email [EMAIL] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_UPDATE_FAILED]: {
    message:
      'Failed to update member with ID [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
  },
  [ErrorCode.MEMBER_DELETE_FAILED]: {
    message:
      'Failed to delete member with ID [MEMBER_ID] from establishment [ESTABLISHMENT_ID].',
  },
} as const;
