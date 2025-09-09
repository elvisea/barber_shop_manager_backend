/**
 * DTO para criação de serviços do agendamento no repositório
 * Contém os dados específicos de cada serviço no momento do agendamento
 */
export class AppointmentServiceRepositoryCreateDTO {
  serviceId: string;
  price: number;
  duration: number;
  commission: number;
}
