import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberResponseDTO } from '../../members/dtos';
import { MemberRelationshipsSummaryDTO } from '../../members/dtos/member-summary-response.dto';
import { MemberMapper } from '../../members/mappers';
import { UserEstablishmentRepository } from '../repositories/user-establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserEstablishmentSummaryService {
  private readonly logger = new Logger(UserEstablishmentSummaryService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
    private readonly prisma: PrismaService,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(
    userId: string,
    requesterId: string,
  ): Promise<{
    member: MemberResponseDTO;
    relationships: MemberRelationshipsSummaryDTO;
  }> {
    this.logger.log(
      `Getting summary for user ${userId} by user ${requesterId}`,
    );

    const user = await this.userRepository.findById(userId);

    if (!user) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        { MEMBER_ID: userId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    const userEstablishments =
      await this.userEstablishmentRepository.findAllByUserWithRelations(userId);

    if (userEstablishments.length === 0) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    const userEstablishment =
      userEstablishments.find((ue) => ue.isActive) || userEstablishments[0];
    if (!userEstablishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }
    const establishmentId = userEstablishment.establishmentId;

    const hasAccess = userEstablishments.some(
      (ue) => ue.establishment.ownerId === requesterId,
    );

    if (!hasAccess) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    const [
      servicesCount,
      productsCount,
      workingHoursCount,
      absencePeriodsCount,
    ] = await Promise.all([
      this.prisma.userService.count({
        where: {
          userId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.userProduct.count({
        where: {
          userId,
          establishmentId,
          deletedAt: null,
        },
      }),
      this.prisma.userWorkingHours.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
      this.prisma.userAbsencePeriod.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

    this.logger.log(
      `Summary retrieved for user ${userId}: ${servicesCount} services, ${productsCount} products, ${workingHoursCount} working hours, ${absencePeriodsCount} absence periods`,
    );

    return {
      member: MemberMapper.toResponseDTO(user, false),
      relationships: {
        services: { total: servicesCount },
        products: { total: productsCount },
        workingHours: { total: workingHoursCount },
        absencePeriods: { total: absencePeriodsCount },
      },
    };
  }
}
