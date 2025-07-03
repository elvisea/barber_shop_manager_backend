import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateEstablishmentRequestDTO } from '../dtos/create-establishment-request.dto';
import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentRepository } from '../repositories/establishment.repository';

@Injectable()
export class EstablishmentCreateService {
  private readonly logger = new Logger(EstablishmentCreateService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) { }

  async execute(
    dto: CreateEstablishmentRequestDTO,
    userId: string,
  ): Promise<EstablishmentResponseDTO> {
    this.logger.log(`Starting establishment creation for userId=${userId} with phone=${dto.phone}`);

    const exists = await this.establishmentRepository.findByPhoneAndUser(dto.phone, userId);

    if (exists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS,
        { USER_ID: userId, PHONE: dto.phone },
      );

      this.logger.warn(`Duplicate establishment creation attempt for userId=${userId} phone=${dto.phone}`);
      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.ESTABLISHMENT_PHONE_ALREADY_EXISTS,
      );
    }

    this.logger.log(`No duplicate establishment found for userId=${userId} phone=${dto.phone}. Proceeding with creation.`);

    const establishment = await this.establishmentRepository.create(dto, userId);

    this.logger.log(`Establishment created successfully. id=${establishment.id} userId=${userId}`);

    return establishment;
  }
} 