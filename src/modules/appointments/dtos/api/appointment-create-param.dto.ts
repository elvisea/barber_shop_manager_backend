import { BaseEstablishmentParamDTO } from '@/common/dtos/base-establishment-param';

/**
 * DTO para parâmetros de criação de agendamento
 * Estende BaseEstablishmentParamDTO para validação do establishmentId
 */
export class AppointmentCreateParamDTO extends BaseEstablishmentParamDTO {
  // establishmentId é herdado de BaseEstablishmentParamDTO
  // com validação @IsUUID() e @IsNotEmpty()
}
