import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

/**
 * Checks if the authenticated user is a member of the establishment
 * specified in the request (params or body).
 * It also attaches the `member` object to the request for downstream use.
 */
@Injectable()
export class EstablishmentMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      // Should be handled by JwtAuthGuard
      return false;
    }

    const establishmentId =
      request.params?.establishmentId || request.body?.establishmentId;

    if (!establishmentId) {
      throw new BadRequestException(
        'Establishment ID not found in request params or body.',
      );
    }

    const member = await this.prisma.establishmentMember.findFirst({
      where: {
        userId: user.id,
        establishmentId: establishmentId,
      },
    });

    if (!member) {
      throw new ForbiddenException(
        'You do not have permission to access this establishment.',
      );
    }

    request.member = member;
    return true;
  }
} 