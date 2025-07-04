import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Service to validate if a user is a member of an establishment and (optionally) has a required role.
 * Throws CustomHttpException if not.
 *
 * Usage: Inject and call validateMembership(establishmentId, userId, role?)
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
