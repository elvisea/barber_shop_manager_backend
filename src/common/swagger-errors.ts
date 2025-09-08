import { ErrorCode } from '@/enums/error-code';

export type SwaggerErrorDoc = {
  description: string;
  example: {
    statusCode: number;
    message: string | string[];
    error: string;
    errorCode: ErrorCode | string | null;
  };
};

export type SwaggerErrorsType = Record<ErrorCode, SwaggerErrorDoc>;

export const SwaggerErrors: SwaggerErrorsType = {
  [ErrorCode.USER_NOT_FOUND]: {
    description: 'User not found',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
      errorCode: ErrorCode.USER_NOT_FOUND,
    },
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    description: 'User already exists',
    example: {
      statusCode: 409,
      message: 'User already exists',
      error: 'Conflict',
      errorCode: ErrorCode.USER_ALREADY_EXISTS,
    },
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED]: {
    description: 'Email already exists and is verified',
    example: {
      statusCode: 409,
      message: 'Email already exists and is verified',
      error: 'Conflict',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED,
    },
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS_NOT_VERIFIED]: {
    description: 'Email already exists but is not verified',
    example: {
      statusCode: 409,
      message: 'Email already exists but is not verified',
      error: 'Conflict',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS_NOT_VERIFIED,
    },
  },
  [ErrorCode.INVALID_CREDENTIALS]: {
    description: 'Invalid credentials',
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized',
      errorCode: ErrorCode.INVALID_CREDENTIALS,
    },
  },
  [ErrorCode.USER_CREATION_FAILED]: {
    description: 'User creation failed',
    example: {
      statusCode: 400,
      message: 'User creation failed',
      error: 'Bad Request',
      errorCode: ErrorCode.USER_CREATION_FAILED,
    },
  },
  [ErrorCode.INVALID_EMAIL_OR_PASSWORD]: {
    description: 'Invalid email or password',
    example: {
      statusCode: 401,
      message: 'Invalid email or password',
      error: 'Unauthorized',
      errorCode: ErrorCode.INVALID_EMAIL_OR_PASSWORD,
    },
  },
  [ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS]: {
    description: 'Establishment phone already exists',
    example: {
      statusCode: 409,
      message: 'Establishment phone already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]: {
    description: 'Establishment not found or access denied',
    example: {
      statusCode: 403,
      message: 'Establishment not found or access denied',
      error: 'Forbidden',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
    },
  },
  [ErrorCode.INSUFFICIENT_ROLE]: {
    description: 'Insufficient role',
    example: {
      statusCode: 403,
      message: 'Insufficient role',
      error: 'Forbidden',
      errorCode: ErrorCode.INSUFFICIENT_ROLE,
    },
  },
  [ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]: {
    description: 'Establishment service name already exists',
    example: {
      statusCode: 409,
      message: 'Establishment service name already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND]: {
    description: 'Establishment service not found',
    example: {
      statusCode: 404,
      message: 'Establishment service not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
    },
  },
  [ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS]: {
    description: 'Establishment product name already exists',
    example: {
      statusCode: 409,
      message: 'Establishment product name already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND]: {
    description: 'Establishment product not found',
    example: {
      statusCode: 404,
      message: 'Establishment product not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
    },
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS]: {
    description: 'A customer with email already exists',
    example: {
      statusCode: 409,
      message: 'A customer with email already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS]: {
    description: 'A customer with phone already exists',
    example: {
      statusCode: 409,
      message: 'A customer with phone already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND]: {
    description: 'Establishment customer not found',
    example: {
      statusCode: 404,
      message: 'Establishment customer not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
    },
  },
  [ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT]: {
    description: 'User not active in any establishment',
    example: {
      statusCode: 403,
      message: 'User not active in any establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT,
    },
  },
  [ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT]: {
    description: 'User role not permitted in any establishment',
    example: {
      statusCode: 403,
      message: 'User role not permitted in any establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT,
    },
  },
  [ErrorCode.ESTABLISHMENT_NOT_FOUND]: {
    description: 'Establishment not found',
    example: {
      statusCode: 404,
      message: 'Establishment not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND,
    },
  },
  [ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER]: {
    description: 'Establishment not owned by user',
    example: {
      statusCode: 403,
      message: 'Establishment not owned by user',
      error: 'Forbidden',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
    },
  },
  [ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT]: {
    description: 'User is not admin in establishment',
    example: {
      statusCode: 403,
      message: 'User is not admin in establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
    },
  },
  [ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS]: {
    description: 'Establishment member already exists',
    example: {
      statusCode: 409,
      message: 'Establishment member already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
    },
  },
  [ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND]: {
    description: 'Establishment member not found',
    example: {
      statusCode: 404,
      message: 'Establishment member not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
    },
  },
  [ErrorCode.VALIDATION_ERROR]: {
    description: 'Validation error',
    example: {
      statusCode: 400,
      message: ['Field X is required', 'Field Y must be a valid email'],
      error: 'Bad Request',
      errorCode: ErrorCode.VALIDATION_ERROR,
    },
  },
  [ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT]: {
    description: 'User is not a member of the establishment',
    example: {
      statusCode: 403,
      message: 'User is not a member of the establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT,
    },
  },
  [ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS]: {
    description: 'Product already assigned to member in this establishment',
    example: {
      statusCode: 409,
      message:
        'Product with PRODUCT_ID [PRODUCT_ID] is already assigned to member [USER_ID] in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS,
    },
  },
  [ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS]: {
    description: 'Service already assigned to member in this establishment',
    example: {
      statusCode: 409,
      message:
        'Service with SERVICE_ID [SERVICE_ID] is already assigned to member [USER_ID] in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
    },
  },
  [ErrorCode.PLAN_NOT_FOUND]: {
    description: 'Plan not found',
    example: {
      statusCode: 404,
      message: 'Plan not found',
      error: 'Not Found',
      errorCode: ErrorCode.PLAN_NOT_FOUND,
    },
  },

  // Novos códigos para Members
  [ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS]: {
    description: 'Member email already exists in establishment',
    example: {
      statusCode: 409,
      message:
        'A member with email [EMAIL] already exists in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS,
    },
  },
  [ErrorCode.MEMBER_PHONE_ALREADY_EXISTS]: {
    description: 'Member phone already exists in establishment',
    example: {
      statusCode: 409,
      message:
        'A member with phone [PHONE] already exists in establishment [ESTABLISHMENT_ID].',
      error: 'Conflict',
      errorCode: ErrorCode.MEMBER_PHONE_ALREADY_EXISTS,
    },
  },
  [ErrorCode.MEMBER_NOT_FOUND]: {
    description: 'Member not found',
    example: {
      statusCode: 404,
      message:
        'Member with ID [MEMBER_ID] not found in establishment [ESTABLISHMENT_ID].',
      error: 'Not Found',
      errorCode: ErrorCode.MEMBER_NOT_FOUND,
    },
  },
  [ErrorCode.MEMBER_CREATION_FAILED]: {
    description: 'Member creation failed',
    example: {
      statusCode: 400,
      message:
        'Failed to create member with email [EMAIL] in establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_CREATION_FAILED,
    },
  },
  [ErrorCode.MEMBER_UPDATE_FAILED]: {
    description: 'Member update failed',
    example: {
      statusCode: 400,
      message:
        'Failed to update member with ID [MEMBER_ID] in establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_UPDATE_FAILED,
    },
  },
  [ErrorCode.MEMBER_DELETE_FAILED]: {
    description: 'Member delete failed',
    example: {
      statusCode: 400,
      message:
        'Failed to delete member with ID [MEMBER_ID] from establishment [ESTABLISHMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.MEMBER_DELETE_FAILED,
    },
  },

  // Códigos para verificação de email
  [ErrorCode.INVALID_VERIFICATION_TOKEN]: {
    description: 'Invalid verification token',
    example: {
      statusCode: 400,
      message: 'Invalid verification token [TOKEN].',
      error: 'Bad Request',
      errorCode: ErrorCode.INVALID_VERIFICATION_TOKEN,
    },
  },
  [ErrorCode.VERIFICATION_TOKEN_EXPIRED]: {
    description: 'Verification token expired',
    example: {
      statusCode: 400,
      message: 'Verification token [TOKEN] has expired.',
      error: 'Bad Request',
      errorCode: ErrorCode.VERIFICATION_TOKEN_EXPIRED,
    },
  },
  [ErrorCode.EMAIL_ALREADY_VERIFIED]: {
    description: 'Email already verified',
    example: {
      statusCode: 409,
      message: 'Email for user [USER_ID] is already verified.',
      error: 'Conflict',
      errorCode: ErrorCode.EMAIL_ALREADY_VERIFIED,
    },
  },
  [ErrorCode.EMAIL_NOT_VERIFIED]: {
    description: 'Email not verified',
    example: {
      statusCode: 401,
      message:
        'Email [EMAIL] is not verified. Please check your email for verification code.',
      error: 'Unauthorized',
      errorCode: ErrorCode.EMAIL_NOT_VERIFIED,
    },
  },
  [ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND]: {
    description: 'User email verification not found',
    example: {
      statusCode: 404,
      message: 'Email verification not found for email [EMAIL].',
      error: 'Not Found',
      errorCode: ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND,
    },
  },

  // Códigos para agendamentos
  [ErrorCode.APPOINTMENT_NOT_FOUND]: {
    description: 'Appointment not found',
    example: {
      statusCode: 404,
      message: 'Appointment with ID [APPOINTMENT_ID] not found.',
      error: 'Not Found',
      errorCode: ErrorCode.APPOINTMENT_NOT_FOUND,
    },
  },
  [ErrorCode.APPOINTMENT_CONFLICT]: {
    description: 'Appointment time conflict',
    example: {
      statusCode: 409,
      message: 'Appointment time conflicts with existing appointment.',
      error: 'Conflict',
      errorCode: ErrorCode.APPOINTMENT_CONFLICT,
    },
  },
  [ErrorCode.APPOINTMENT_INVALID_TIME]: {
    description: 'Invalid appointment time',
    example: {
      statusCode: 400,
      message: 'Invalid appointment time. Start time must be before end time.',
      error: 'Bad Request',
      errorCode: ErrorCode.APPOINTMENT_INVALID_TIME,
    },
  },
  [ErrorCode.APPOINTMENT_MEMBER_UNAVAILABLE]: {
    description: 'Member unavailable for appointment',
    example: {
      statusCode: 409,
      message: 'Member [MEMBER_ID] is unavailable at the requested time.',
      error: 'Conflict',
      errorCode: ErrorCode.APPOINTMENT_MEMBER_UNAVAILABLE,
    },
  },
  [ErrorCode.APPOINTMENT_ESTABLISHMENT_CLOSED]: {
    description: 'Establishment closed at appointment time',
    example: {
      statusCode: 409,
      message: 'Establishment is closed at the requested appointment time.',
      error: 'Conflict',
      errorCode: ErrorCode.APPOINTMENT_ESTABLISHMENT_CLOSED,
    },
  },
  [ErrorCode.APPOINTMENT_SERVICE_NOT_AVAILABLE]: {
    description: 'Service not available for appointment',
    example: {
      statusCode: 409,
      message:
        'Service [SERVICE_ID] is not available for the requested appointment.',
      error: 'Conflict',
      errorCode: ErrorCode.APPOINTMENT_SERVICE_NOT_AVAILABLE,
    },
  },
  [ErrorCode.APPOINTMENT_CUSTOMER_NOT_FOUND]: {
    description: 'Customer not found for appointment',
    example: {
      statusCode: 404,
      message: 'Customer [CUSTOMER_ID] not found for appointment.',
      error: 'Not Found',
      errorCode: ErrorCode.APPOINTMENT_CUSTOMER_NOT_FOUND,
    },
  },
  [ErrorCode.APPOINTMENT_CREATION_FAILED]: {
    description: 'Appointment creation failed',
    example: {
      statusCode: 400,
      message: 'Failed to create appointment.',
      error: 'Bad Request',
      errorCode: ErrorCode.APPOINTMENT_CREATION_FAILED,
    },
  },
  [ErrorCode.APPOINTMENT_UPDATE_FAILED]: {
    description: 'Appointment update failed',
    example: {
      statusCode: 400,
      message: 'Failed to update appointment [APPOINTMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.APPOINTMENT_UPDATE_FAILED,
    },
  },
  [ErrorCode.APPOINTMENT_DELETE_FAILED]: {
    description: 'Appointment delete failed',
    example: {
      statusCode: 400,
      message: 'Failed to delete appointment [APPOINTMENT_ID].',
      error: 'Bad Request',
      errorCode: ErrorCode.APPOINTMENT_DELETE_FAILED,
    },
  },
  [ErrorCode.INVALID_TIME_RANGE]: {
    description: 'Invalid time range',
    example: {
      statusCode: 400,
      message:
        'Invalid time range: start time [START_TIME] must be before end time [END_TIME].',
      error: 'Bad Request',
      errorCode: ErrorCode.INVALID_TIME_RANGE,
    },
  },
};
