# 🚀 Configuração do GitHub Actions - Barber Shop Manager

Este documento explica como configurar os secrets necessários para o pipeline CI/CD do GitHub Actions.

## 📋 Secrets Necessários

Configure os seguintes secrets no seu repositório GitHub:

### 🐳 Docker Hub
- `DOCKER_HUB_USERNAME` - Seu username do Docker Hub
- `DOCKER_HUB_PASSWORD` - Sua senha/token do Docker Hub

### 🗄️ Banco de Dados
- `POSTGRES_USER` - Usuário do banco de dados
- `POSTGRES_PASSWORD` - Senha do banco de dados
- `POSTGRES_DB` - Nome do banco de dados
- `POSTGRES_PORT` - Porta interna do PostgreSQL (5432)
- `POSTGRES_EXTERNAL_PORT` - Porta externa do PostgreSQL (5434)

### 🔐 JWT
- `JWT_SECRET_PUBLIC_KEY` - Chave pública JWT
- `JWT_SECRET_PRIVATE_KEY` - Chave privada JWT
- `ACCESS_TOKEN_EXPIRATION` - Expiração do token de acesso (ex: 60s)
- `REFRESH_TOKEN_EXPIRATION` - Expiração do refresh token (ex: 7d)

### 📧 Email
- `MAIL_HOST` - Host do servidor SMTP
- `MAIL_PORT` - Porta do servidor SMTP
- `MAIL_SECURE` - Se usa SSL/TLS (true/false)
- `MAIL_USER` - Usuário do email
- `MAIL_PASS` - Senha do email

### 🔗 API Externa
- `EVOLUTION_API_KEY` - Chave da API Evolution
- `EVOLUTION_API_URL` - URL da API Evolution

### 🤖 IA
- `AI_PROVIDER` - Provedor de IA (ex: deepseek)
- `DEEPSEEK_BASE_URL` - URL base do Deepseek
- `DEEPSEEK_API_KEY` - Chave da API Deepseek
- `VERBOSE_LOGGING` - Logs verbosos (true/false)

### 🔧 MCP (Opcional)
- `MCP_SERVER_URL` - URL do servidor MCP
- `MCP_SERVER_PATH` - Caminho do servidor MCP

### 🐳 Containers
- `CONTAINER_NAME_APP` - Nome do container da aplicação
- `CONTAINER_NAME_DATABASE` - Nome do container do banco

### 🚀 Deploy
- `SSH_PRIVATE_KEY` - Chave privada SSH para o servidor
- `REMOTE_HOST` - IP/hostname do servidor
- `REMOTE_PORT` - Porta SSH (geralmente 22)
- `REMOTE_USER` - Usuário SSH
- `REMOTE_TARGET` - Diretório de destino no servidor

## 🔧 Como Configurar os Secrets

### 1. Acesse o Repositório
1. Vá para seu repositório no GitHub
2. Clique em **Settings**
3. No menu lateral, clique em **Secrets and variables** → **Actions**

### 2. Adicione os Secrets
1. Clique em **New repository secret**
2. Digite o nome do secret (ex: `DOCKER_HUB_USERNAME`)
3. Digite o valor do secret
4. Clique em **Add secret**

### 3. Repita para Todos os Secrets
Adicione todos os secrets listados acima seguindo o mesmo processo.

## 🚀 Como o Pipeline Funciona

### 1. **Quality Check**
- Executa quando há um Pull Request para `main`
- Verifica mudanças em `src/`, `package.json`, `Dockerfile`, etc.
- Instala dependências com `npm ci`
- Gera cliente Prisma
- Executa ESLint
- Faz build da aplicação

### 2. **Test**
- Executa após Quality Check
- Roda testes unitários e E2E
- Continua mesmo se alguns testes falharem

### 3. **Build**
- Executa após Test
- Faz build da aplicação
- Constrói imagem Docker
- Faz push para Docker Hub

### 4. **Deploy**
- Executa após Build
- Conecta ao servidor via SSH
- Cria diretório de destino se necessário
- Transfere arquivos (`docker-compose.yml`, `Dockerfile`, `.env`)
- Executa deploy com Docker Compose

## 📁 Estrutura do Pipeline

```
.github/
└── workflows/
    └── pipeline.yml
```

## 🔍 Triggers

O pipeline é executado quando:
- Há um Pull Request para a branch `main`
- Mudanças em arquivos específicos:
  - `src/**`
  - `package.json`
  - `package-lock.json`
  - `.github/workflows/**`
  - `Dockerfile`
  - `docker-compose.yml`
  - `prisma/**`

## ⚠️ Importante

### Segurança
- **Nunca** commite secrets no código
- Use sempre os secrets do GitHub Actions
- Mantenha as chaves SSH seguras

### Configuração do Servidor
- O servidor deve ter Docker e Docker Compose instalados
- O usuário SSH deve ter permissões para executar Docker
- A rede `barber_evolution_net` deve existir no servidor

### Docker Hub
- Crie uma conta no Docker Hub
- Gere um token de acesso (não use a senha)
- Configure o repositório no Docker Hub

## 🛠️ Troubleshooting

### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se o Node.js 22 está sendo usado

### Erro de Deploy
- Verifique se a chave SSH está correta
- Confirme se o usuário tem permissões no servidor
- Verifique se o diretório de destino existe

### Erro de Docker
- Confirme se as credenciais do Docker Hub estão corretas
- Verifique se a imagem foi construída corretamente

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do GitHub Actions
2. Confirme se todos os secrets estão configurados
3. Teste a conexão SSH manualmente
4. Verifique se o Docker está funcionando no servidor 