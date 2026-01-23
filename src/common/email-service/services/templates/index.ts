// Templates de email profissionais para Barber Shop Manager

const accountCreation = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Bem-vindo ao Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Bem-vindo ao Barber Shop Manager!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Sua conta foi criada com sucesso! Para completar o cadastro, você precisa verificar seu endereço de email.
              </p>
              
              <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
                <p style="margin: 0 0 0.5rem 0; color: #64748B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Código de Verificação
                </p>
                <p style="margin: 0; color: #0F172A; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Geist Mono', monospace;">
                  [token]
                </p>
              </div>
              
              <p style="margin: 1.5rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Este código expira em <strong>[expiresAt]</strong>. Use-o para verificar sua conta.
              </p>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Se você não criou esta conta, pode ignorar este email com segurança.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const accountCreationExisting = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Verifique seu Email - Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Verifique seu Email</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; margin-bottom: 1.5rem; border-radius: 0.5rem;">
                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6; font-weight: 600;">
                  ⚠️ Você já possui uma conta cadastrada, mas seu email ainda não foi verificado.
                </p>
              </div>
              
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Você já está cadastrado em nossa plataforma, mas ainda precisa verificar seu endereço de email para acessar sua conta.
              </p>
              
              <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
                <p style="margin: 0 0 0.5rem 0; color: #64748B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Código de Verificação
                </p>
                <p style="margin: 0; color: #0F172A; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Geist Mono', monospace;">
                  [token]
                </p>
              </div>
              
              <p style="margin: 1.5rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Este código expira em <strong>[expiresAt]</strong>. Use-o para verificar sua conta e começar a usar o Barber Shop Manager.
              </p>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Se você não solicitou este código, pode ignorar este email com segurança.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const emailVerificationResend = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Novo Código de Verificação - Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Novo Código de Verificação</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Você solicitou um novo código de verificação para seu email. Use o código abaixo para verificar sua conta.
              </p>
              
              <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
                <p style="margin: 0 0 0.5rem 0; color: #64748B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Código de Verificação
                </p>
                <p style="margin: 0; color: #0F172A; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Geist Mono', monospace;">
                  [token]
                </p>
              </div>
              
              <p style="margin: 1.5rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Este código expira em <strong>[expiresAt]</strong>. Use-o para verificar sua conta.
              </p>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Se você não solicitou este código, pode ignorar este email com segurança.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const emailVerificationSuccess = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Email Verificado com Sucesso - Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Email Verificado!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <div style="text-align: center; margin-bottom: 2rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 40px; height: 40px; color: #FFFFFF;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6; text-align: center;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6; text-align: center;">
                Seu email foi verificado com sucesso! Sua conta está agora totalmente ativada e você pode começar a usar o Barber Shop Manager.
              </p>
              
              <div style="background-color: #ECFDF5; border: 2px solid #10B981; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.6; text-align: center; font-weight: 600;">
                  ✅ Conta verificada e pronta para uso!
                </p>
              </div>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6; text-align: center;">
                Bem-vindo ao Barber Shop Manager! Estamos felizes em tê-lo conosco.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const passwordReset = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Redefinição de Senha - Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Redefinição de Senha</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6;">
                Você solicitou a redefinição de senha da sua conta. Use o código abaixo para redefinir sua senha.
              </p>
              
              <div style="background-color: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
                <p style="margin: 0 0 0.5rem 0; color: #64748B; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  Código de Redefinição
                </p>
                <p style="margin: 0; color: #0F172A; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Geist Mono', monospace;">
                  [token]
                </p>
              </div>
              
              <p style="margin: 1.5rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Este código expira em <strong>[expiresAt]</strong>. Use-o para redefinir sua senha.
              </p>
              
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6; font-weight: 600;">
                  ⚠️ Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.
                </p>
              </div>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6;">
                Por segurança, nunca compartilhe este código com outras pessoas.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const passwordResetSuccess = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap" rel="stylesheet">
  <title>Senha Redefinida com Sucesso - Barber Shop Manager</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8FAFC;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #F8FAFC; padding: 20px 0;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFFFF; border-radius: 0.625rem; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); padding: 2rem; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Senha Redefinida!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 2rem;">
              <div style="text-align: center; margin-bottom: 2rem;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <svg style="width: 40px; height: 40px; color: #FFFFFF;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <p style="margin: 0 0 1rem 0; color: #0F172A; font-size: 16px; line-height: 1.6; text-align: center;">
                Olá, <strong>[name]</strong>!
              </p>
              
              <p style="margin: 0 0 1.5rem 0; color: #0F172A; font-size: 16px; line-height: 1.6; text-align: center;">
                Sua senha foi redefinida com sucesso! Você pode fazer login com sua nova senha.
              </p>
              
              <div style="background-color: #ECFDF5; border: 2px solid #10B981; border-radius: 0.625rem; padding: 1.5rem; margin: 1.5rem 0;">
                <p style="margin: 0; color: #065F46; font-size: 14px; line-height: 1.6; text-align: center; font-weight: 600;">
                  ✅ Senha atualizada com sucesso!
                </p>
              </div>
              
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 1rem; margin: 1.5rem 0; border-radius: 0.5rem;">
                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6;">
                  🔒 Por segurança, todos os seus dispositivos foram desconectados. Você precisará fazer login novamente em todos os dispositivos.
                </p>
              </div>
              
              <p style="margin: 2rem 0 0 0; color: #64748B; font-size: 14px; line-height: 1.6; text-align: center;">
                Se você não solicitou esta alteração, entre em contato conosco imediatamente.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 1.5rem 2rem; text-align: center; border-top: 1px solid #E2E8F0;">
              <p style="margin: 0; color: #64748B; font-size: 12px; line-height: 1.6;">
                © ${new Date().getFullYear()} Barber Shop Manager. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const templates = {
  account_creation: accountCreation,
  account_creation_existing: accountCreationExisting,
  email_verification_resend: emailVerificationResend,
  email_verification_success: emailVerificationSuccess,
  password_reset: passwordReset,
  password_reset_success: passwordResetSuccess,
};

export default templates;
