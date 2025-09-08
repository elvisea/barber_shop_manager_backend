/**
 * DTOs do módulo de agendamentos - Camada de API
 *
 * Este arquivo centraliza todas as exportações dos DTOs
 * específicos da camada de API (controllers).
 */

// Request DTOs
export { AppointmentCreateRequestDTO } from './appointment-create-request.dto';
export { AppointmentFindAllQueryDTO } from './appointment-find-all-query.dto';
export { AppointmentUpdateRequestDTO } from './appointment-update-request.dto';

// Response DTOs
export { AppointmentCreateResponseDTO } from './appointment-create-response.dto';
export { AppointmentFindAllResponseDTO } from './appointment-find-all-response.dto';
export { AppointmentFindOneResponseDTO } from './appointment-find-one-response.dto';

// Parameter DTOs
export { AppointmentDeleteParamDTO } from './appointment-delete-param.dto';
export { AppointmentFindByIdParamDTO } from './appointment-find-by-id-param.dto';
export { AppointmentUpdateParamDTO } from './appointment-update-param.dto';
