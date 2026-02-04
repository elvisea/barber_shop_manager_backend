import { Inject, Injectable, Logger } from '@nestjs/common';

import { APPOINTMENT_CREATE_BUSINESS_RULES } from '../constants/appointment-create-rules.token';
import type { IAppointmentCreateBusinessRule } from '../contracts/appointment-create-business-rule.interface';
import { AppointmentCreateRequestDTO } from '../dtos/api/appointment-create-request.dto';
import { AppointmentCreateResponseDTO } from '../dtos/api/appointment-create-response.dto';
import { AppointmentRepositoryMapper } from '../mappers/appointment-repository.mapper';
import { AppointmentToResponseMapper } from '../mappers/appointment-to-response.mapper';
import { AppointmentRepository } from '../repositories/appointment.repository';

import { AppointmentAccessValidationService } from './appointment-access-validation.service';
import { AppointmentCreateBusinessRulesService } from './appointment-create-business-rules.service';

/**
 * Serviço responsável por orquestrar a criação de agendamentos.
 *
 * @description
 * Este serviço coordena todo o fluxo de criação de um agendamento, garantindo
 * a validação de acesso, permissões e regras de negócio antes da persistência.
 *
 * O fluxo de execução segue a seguinte ordem:
 * 1. **Validação de Acesso** - Verifica se o usuário tem acesso ao estabelecimento
 *    e permissão para criar agendamentos (via {@link AppointmentAccessValidationService})
 * 2. **Validação de Entidades** - Confirma a existência do cliente, membro e serviços
 * 3. **Regras de Negócio Extensíveis** - Executa regras injetadas via {@link APPOINTMENT_CREATE_BUSINESS_RULES}
 * 4. **Cálculos e Verificação de Conflitos** - Calcula totais e verifica conflitos de horário
 *    (via {@link AppointmentCreateBusinessRulesService})
 * 5. **Persistência** - Salva o agendamento no banco de dados
 *
 * @remarks
 * Para adicionar novas regras de criação, não é necessário modificar este serviço.
 * Basta registrar a nova regra que implementa {@link IAppointmentCreateBusinessRule}
 * no módulo de agendamentos.
 *
 * @example
 * ```typescript
 * const response = await appointmentCreateService.execute(
 *   createDto,
 *   'establishment-uuid',
 *   'owner-uuid'
 * );
 * ```
 *
 * @see {@link AppointmentAccessValidationService} - Serviço de validação de acesso
 * @see {@link AppointmentCreateBusinessRulesService} - Serviço de regras de negócio
 * @see {@link IAppointmentCreateBusinessRule} - Interface para regras extensíveis
 */
@Injectable()
export class AppointmentCreateService {
  private readonly logger = new Logger(AppointmentCreateService.name);

  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentAccessValidationService: AppointmentAccessValidationService,
    private readonly appointmentCreateBusinessRulesService: AppointmentCreateBusinessRulesService,
    @Inject(APPOINTMENT_CREATE_BUSINESS_RULES)
    private readonly createBusinessRules: IAppointmentCreateBusinessRule[],
  ) {}

  /**
   * Executa a criação de um novo agendamento.
   *
   * @description
   * Método principal que orquestra todas as validações e processamentos
   * necessários para criar um agendamento válido no sistema.
   *
   * O fluxo detalhado inclui:
   * 1. Validação de acesso ao estabelecimento e permissão de agendamento
   * 2. Verificação se o solicitante pode agir em nome do membro alvo
   *    (OWNER/RECEPTIONIST = qualquer membro; BARBER/HAIRDRESSER = apenas si mesmo)
   * 3. Validação da existência do cliente no estabelecimento
   * 4. Validação da existência do usuário/membro no estabelecimento
   * 5. Validação e recuperação dos serviços selecionados
   * 6. Execução das regras de negócio extensíveis
   * 7. Cálculo de totais (valor e duração) e horário de término
   * 8. Verificação de conflitos de horário com outros agendamentos
   * 9. Validação do intervalo de tempo (startTime < endTime)
   * 10. Mapeamento dos dados para o repositório
   * 11. Persistência do agendamento no banco de dados
   * 12. Mapeamento e retorno da resposta formatada
   *
   * @param dto - Dados da requisição de criação do agendamento
   * @param dto.customerId - UUID do cliente que será atendido
   * @param dto.userId - UUID do membro/profissional que realizará o atendimento
   * @param dto.startTime - Data e hora de início do agendamento
   * @param dto.serviceIds - Lista de UUIDs dos serviços a serem realizados
   * @param dto.notes - Observações opcionais sobre o agendamento
   * @param establishmentId - UUID do estabelecimento onde será criado o agendamento
   * @param ownerId - UUID do usuário que está realizando a requisição (autenticado)
   *
   * @returns Promise com os dados do agendamento criado, incluindo nomes
   *          para exibição (cliente, profissional, serviços)
   *
   * @throws {UnauthorizedException} Se o usuário não tiver acesso ao estabelecimento
   * @throws {ForbiddenException} Se o usuário não tiver permissão para criar agendamentos
   * @throws {NotFoundException} Se cliente, membro ou serviços não forem encontrados
   * @throws {ConflictException} Se houver conflito de horário com outro agendamento
   * @throws {BadRequestException} Se os dados da requisição forem inválidos
   *
   * @example
   * ```typescript
   * const createDto: AppointmentCreateRequestDTO = {
   *   customerId: 'customer-uuid',
   *   userId: 'barber-uuid',
   *   startTime: new Date('2026-02-05T10:00:00'),
   *   serviceIds: ['service-uuid-1', 'service-uuid-2'],
   *   notes: 'Cliente prefere corte mais curto nas laterais'
   * };
   *
   * const response = await service.execute(
   *   createDto,
   *   'establishment-uuid',
   *   'logged-user-uuid'
   * );
   * // response: AppointmentCreateResponseDTO
   * ```
   */
  async execute(
    dto: AppointmentCreateRequestDTO,
    establishmentId: string,
    ownerId: string,
  ): Promise<AppointmentCreateResponseDTO> {
    this.logger.log(
      `Creating appointment for customer ${dto.customerId} in establishment ${establishmentId}`,
    );

    // 1. Establishment access + appointment permission (centralized access + who can act for whom)
    const accessResult =
      await this.appointmentAccessValidationService.validateCanCreate(
        establishmentId,
        ownerId,
      );

    // 2. Requester can act for target member (OWNER/RECEPTIONIST = any; BARBER/HAIRDRESSER = self only)
    this.appointmentAccessValidationService.assertRequesterCanActForMember(
      accessResult,
      ownerId,
      dto.userId,
    );

    // 3. Validar cliente existe no estabelecimento
    await this.appointmentAccessValidationService.validateCustomer(
      establishmentId,
      dto.customerId,
    );

    // 4. Validar usuário existe no estabelecimento
    await this.appointmentAccessValidationService.validateUser(
      establishmentId,
      dto.userId,
    );

    // 5. Validar e buscar serviços do membro (verifica atribuição + retorna dados personalizados)
    const memberServices =
      await this.appointmentAccessValidationService.validateUserAllowedServices(
        establishmentId,
        dto.userId,
        dto.serviceIds,
      );

    // 6. Extensible business rules (e.g. member services allowed)
    const ruleContext = {
      establishmentId,
      userId: dto.userId,
      serviceIds: dto.serviceIds,
    };
    for (const rule of this.createBusinessRules) {
      await rule.validate(ruleContext);
    }

    // 7. Calcular totais e endTime baseado nos serviços do membro
    const { totalAmount, totalDuration, endTime } =
      this.appointmentCreateBusinessRulesService.calculateTotalsAndEndTimeFromMemberServices(
        dto.startTime,
        memberServices,
      );

    // 8. Validar conflito de horários
    await this.appointmentCreateBusinessRulesService.validateNoTimeConflict(
      dto.userId,
      dto.startTime,
      new Date(endTime),
    );

    // 9. Validar horários
    this.appointmentCreateBusinessRulesService.validateTimeRange(
      dto.startTime,
      endTime,
    );

    // 10. Criar dados para o repositório usando serviços do membro
    const repositoryData =
      AppointmentRepositoryMapper.toRepositoryCreateDTOFromMemberServices({
        customerId: dto.customerId,
        userId: dto.userId,
        establishmentId,
        startTime: dto.startTime,
        endTime,
        totalAmount,
        totalDuration,
        notes: dto.notes,
        memberServices,
      });

    // 11. Criar agendamento no banco
    const appointment = await this.appointmentRepository.create(repositoryData);

    this.logger.log(
      `Appointment created successfully with ID: ${appointment.id}`,
    );

    // 12. Retornar resposta com nomes para exibição no card
    return AppointmentToResponseMapper.toResponseDTO(appointment);
  }
}
