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
};
