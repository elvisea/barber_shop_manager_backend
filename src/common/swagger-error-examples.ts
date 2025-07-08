import { ErrorCode } from '@/enums/error-code';

export const SwaggerErrorExamples = {
  userNotFound: {
    description: 'USER_NOT_FOUND',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'Not Found',
      errorCode: ErrorCode.USER_NOT_FOUND,
    },
  },
  userAlreadyExists: {
    description: 'USER_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'User already exists',
      error: 'Conflict',
      errorCode: ErrorCode.USER_ALREADY_EXISTS,
    },
  },
  emailAlreadyExistsVerified: {
    description: 'EMAIL_ALREADY_EXISTS_VERIFIED',
    example: {
      statusCode: 409,
      message: 'Email already exists and is verified',
      error: 'Conflict',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS_VERIFIED,
    },
  },
  emailAlreadyExistsNotVerified: {
    description: 'EMAIL_ALREADY_EXISTS_NOT_VERIFIED',
    example: {
      statusCode: 409,
      message: 'Email already exists but is not verified',
      error: 'Conflict',
      errorCode: ErrorCode.EMAIL_ALREADY_EXISTS_NOT_VERIFIED,
    },
  },
  invalidCredentials: {
    description: 'INVALID_CREDENTIALS',
    example: {
      statusCode: 401,
      message: 'Invalid credentials',
      error: 'Unauthorized',
      errorCode: ErrorCode.INVALID_CREDENTIALS,
    },
  },
  userCreationFailed: {
    description: 'USER_CREATION_FAILED',
    example: {
      statusCode: 400,
      message: 'User creation failed',
      error: 'Bad Request',
      errorCode: ErrorCode.USER_CREATION_FAILED,
    },
  },
  invalidEmailOrPassword: {
    description: 'INVALID_EMAIL_OR_PASSWORD',
    example: {
      statusCode: 401,
      message: 'Invalid email or password',
      error: 'Unauthorized',
      errorCode: ErrorCode.INVALID_EMAIL_OR_PASSWORD,
    },
  },
  establishmentPhoneAlreadyExists: {
    description: 'ESTABLISHMENT_PHONE_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'Establishment phone already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS,
    },
  },
  establishmentNotFoundOrAccessDenied: {
    description: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
    example: {
      statusCode: 403,
      message: 'Establishment not found or access denied',
      error: 'Forbidden',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
    },
  },
  insufficientRole: {
    description: 'INSUFFICIENT_ROLE',
    example: {
      statusCode: 403,
      message: 'Insufficient role',
      error: 'Forbidden',
      errorCode: ErrorCode.INSUFFICIENT_ROLE,
    },
  },
  establishmentServiceNameAlreadyExists: {
    description: 'ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'Establishment service name already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS,
    },
  },
  establishmentServiceNotFound: {
    description: 'ESTABLISHMENT_SERVICE_NOT_FOUND',
    example: {
      statusCode: 404,
      message: 'Establishment service not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
    },
  },
  establishmentProductNameAlreadyExists: {
    description: 'ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'Establishment product name already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS,
    },
  },
  establishmentProductNotFound: {
    description: 'ESTABLISHMENT_PRODUCT_NOT_FOUND',
    example: {
      statusCode: 404,
      message: 'Establishment product not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND,
    },
  },
  establishmentCustomerEmailAlreadyExists: {
    description: 'ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'A customer with email already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS,
    },
  },
  establishmentCustomerPhoneAlreadyExists: {
    description: 'ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'A customer with phone already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS,
    },
  },
  establishmentCustomerNotFound: {
    description: 'ESTABLISHMENT_CUSTOMER_NOT_FOUND',
    example: {
      statusCode: 404,
      message: 'Establishment customer not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND,
    },
  },
  userNotActiveInAnyEstablishment: {
    description: 'USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT',
    example: {
      statusCode: 403,
      message: 'User not active in any establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_NOT_ACTIVE_IN_ANY_ESTABLISHMENT,
    },
  },
  userRoleNotPermittedAnyEstablishment: {
    description: 'USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT',
    example: {
      statusCode: 403,
      message: 'User role not permitted in any establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_ROLE_NOT_PERMITTED_ANY_ESTABLISHMENT,
    },
  },
  establishmentNotFound: {
    description: 'ESTABLISHMENT_NOT_FOUND',
    example: {
      statusCode: 404,
      message: 'Establishment not found',
      error: 'Not Found',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_FOUND,
    },
  },
  establishmentNotOwnedByUser: {
    description: 'ESTABLISHMENT_NOT_OWNED_BY_USER',
    example: {
      statusCode: 403,
      message: 'Establishment not owned by user',
      error: 'Forbidden',
      errorCode: ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
    },
  },
  userNotAdminInEstablishment: {
    description: 'USER_NOT_ADMIN_IN_ESTABLISHMENT',
    example: {
      statusCode: 403,
      message: 'User is not admin in establishment',
      error: 'Forbidden',
      errorCode: ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT,
    },
  },
  establishmentMemberAlreadyExists: {
    description: 'ESTABLISHMENT_MEMBER_ALREADY_EXISTS',
    example: {
      statusCode: 409,
      message: 'Establishment member already exists',
      error: 'Conflict',
      errorCode: ErrorCode.ESTABLISHMENT_MEMBER_ALREADY_EXISTS,
    },
  },
  validationError: {
    description: 'VALIDATION_ERROR',
    example: {
      statusCode: 400,
      message: ['Field X is required', 'Field Y must be a valid email'],
      error: 'Bad Request',
      errorCode: 'VALIDATION_ERROR',
    },
  },
};
