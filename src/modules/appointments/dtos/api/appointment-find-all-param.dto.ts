import { BaseEstablishmentParamDTO } from '@/common/dtos/base-establishment-param';

/**
 * DTO para parâmetros de listagem de agendamentos
 * Estende BaseEstablishmentParamDTO para validação do establishmentId
 */
export class AppointmentFindAllParamDTO extends BaseEstablishmentParamDTO {
  // establishmentId é herdado de BaseEstablishmentParamDTO
  // com validação @IsUUID() e @IsNotEmpty()
}
