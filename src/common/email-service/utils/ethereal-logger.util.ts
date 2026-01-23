/**
 * Utilitário para logs relacionados ao Ethereal Email
 */

/**
 * Loga informações sobre a conta Ethereal criada automaticamente
 */
export function logEtherealAccountCreated(
  username: string,
  password: string,
): void {
  console.log('✅ Conta Ethereal criada com sucesso!');
  console.log(`   Username: ${username}`);
  console.log(`   Password: ${password}`);
  console.log('   ⚠️  Esta conta expira após 48h de inatividade.');
  console.log(
    '   💡 Para uma conta persistente, configure ETHEREAL_USERNAME e ETHEREAL_PASSWORD no .env',
  );
}
