import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentRepository } from '../repositories/establishment.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

@Injectable()
export class EstablishmentDeleteService {
  private readonly logger = new Logger(EstablishmentDeleteService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  async execute(establishmentId: string, userId: string): Promise<void> {
    this.logger.log(
      `Deleting establishment ${establishmentId} by user ${userId}`,
    );

    // Validar se o usuário é owner/admin do estabelecimento
    const establishment = await this.establishmentRepository.findByIdAndUser(
      establishmentId,
      userId,
    );
    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: userId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED,
      );
    }

    await this.establishmentRepository.deleteByIdAndUser(establishmentId);

    this.logger.log(`Establishment ${establishmentId} deleted successfully.`);
  }
}
