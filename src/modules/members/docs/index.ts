/**
 * Documentação Swagger para controllers de membros
 *
 * Este arquivo centraliza todas as documentações dos endpoints
 * do módulo de membros para facilitar importação e manutenção.
 */

// Create operations
export { CreateMemberDocs } from './create-member.docs';

// Read operations
export { FindAllMembersDocs } from './find-all-members.docs';
export { FindMemberByIdDocs } from './find-member-by-id.docs';

// Update operations
export { UpdateMemberDocs } from './update-member.docs';

// Delete operations
export { DeleteMemberDocs } from './delete-member.docs';

// Email verification operations
export { VerifyMemberEmailDocs } from './verify-email.docs';
export { ResendMemberVerificationDocs } from './resend-verification.docs';

// Summary operations
export { MemberSummaryDocs } from './member-summary.docs';
