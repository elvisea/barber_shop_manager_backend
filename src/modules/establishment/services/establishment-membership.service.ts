import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Service responsible for validating if a user is a member of a given establishment and,
 * optionally, if the user has one of the required roles to perform an action.
 *
 * ---
 * CONTEXT (2024):
 * - This service centralizes all logic related to membership and role validation for establishments.
 * - It is used in controllers and services to ensure that only users who are members of an establishment
 *   (and, if necessary, have a specific role) can access or modify establishment data.
 * - The validation is performed by querying the establishmentMember table, including the related establishment.
 * - If the user is not a member, or does not have the required role(s), a CustomHttpException is thrown
 *   with a standardized error message and proper HTTP status code.
 *
 * WHY THIS EXISTS:
 * - To avoid code duplication and ensure a single source of truth for membership/role validation.
 * - To make it easy to change the validation logic in the future (e.g., if new rules or relationships are added).
 * - To improve security and maintainability by enforcing access rules in a single, well-documented place.
 *
 * HOW TO USE:
 * - Inject this service where needed (controllers/services).
 * - Call validateMembership(establishmentId, userId, roles?) passing the establishment ID, user ID,
 *   and (optionally) an array of allowed roles (from the Role enum).
 * - If validation passes, the method returns the member (with establishment included).
 * - If validation fails, an exception is thrown and should be handled by the global exception filter.
 *
 * FUTURE CONSIDERATIONS:
 * - If the system evolves to require more granular permissions (e.g., per-action, per-resource),
 *   this service may need to be extended or refactored.
 * - If new relationships or status fields are added to establishment/member, consider including them in the query/validation.
 * - Always update this documentation when changing the validation logic or the context of use.
 *
 * See also: ErrorMessageService, CustomHttpException, Role enum.
 */
@Injectable()
export class EstablishmentMembershipService {
  private readonly logger = new Logger(EstablishmentMembershipService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async validateMembership(
    establishmentId: string,
    userId: string,
    roles?: Role[],
  ) {
    const memberWithEstablishment =
      await this.prisma.establishmentMember.findFirst({
        where: { establishmentId, userId },
        include: { establishment: true },
      });

    if (!memberWithEstablishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: userId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    if (roles && !roles.includes(memberWithEstablishment.role)) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.INSUFFICIENT_ROLE,
        {
          USER_ID: userId,
          ESTABLISHMENT_ID: establishmentId,
          ROLE: roles.join(','),
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.INSUFFICIENT_ROLE,
      );
    }

    return memberWithEstablishment;
  }
}
