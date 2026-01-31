import { EstablishmentAccessResult } from '../types/establishment-access-result.type';

/**
 * Contract for the centralized establishment-access service.
 * Consumers (Me, Appointments) depend on this interface, not on the concrete implementation.
 */
export interface IEstablishmentAccessService {
  /**
   * Asserts that the user can access the establishment (owner or active member).
   * Use when the caller only needs a yes/no answer.
   * @throws CustomHttpException when establishment is not found or user has no access
   */
  assertUserCanAccessEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void>;

  /**
   * Returns establishment access details (establishment, isOwner, userEstablishment.role).
   * Use when the caller needs role/isOwner for further permission logic.
   * @throws CustomHttpException when establishment is not found or user has no access
   */
  getEstablishmentAccess(
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentAccessResult>;
}
