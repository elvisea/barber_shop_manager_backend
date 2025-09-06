# 🚀 Configuração de Produção - Barber Shop Manager

## 📋 Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### 🐳 Docker Configuration
```bash
REGISTRY=docker.io
IMAGE_NAME=elvisea/barber_shop_manager_backend
TAG=latest
CONTAINER_NAME_APP=barber_shop_manager_backend_app
CONTAINER_NAME_DATABASE=barber_shop_manager_backend_db
```

### ⚙️ Application Configuration
```bash
NODE_ENV=production
PORT=3333
LOG_LEVEL=info
```

### 🗄️ Database Configuration
```bash
POSTGRES_PORT=5432
POSTGRES_EXTERNAL_PORT=5434
POSTGRES_DB=your_db_name
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
DATABASE_URL=postgresql://your_db_user:your_db_password@db:5432/your_db_name?schema=public
```

### 🔐 JWT Configuration
```bash
ACCESS_TOKEN_EXPIRATION=60s
REFRESH_TOKEN_EXPIRATION=7d
JWT_SECRET_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
JWT_SECRET_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```

### 📧 Email Configuration
```bash
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
```

### 🔗 External API Configuration
```bash
EVOLUTION_API_KEY=your_api_key
EVOLUTION_API_URL=your_api_url
```

### 🤖 AI Configuration
```bash
AI_PROVIDER=your_ai_provider
DEEPSEEK_BASE_URL=your_base_url
DEEPSEEK_API_KEY=your_deepseek_api_key
VERBOSE_LOGGING=your_verbose_logging
```

### 🔧 MCP Configuration (Opcional)
```bash
MCP_SERVER_URL=your_server_url
MCP_SERVER_PATH=your_server_path
```

## 🚀 Como Executar em Produção

### 1. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Editar o arquivo .env com suas configurações de produção
```

### 2. Build e Execução
```bash
# Build da imagem
docker-compose build

# Executar em produção
docker-compose up -d

# Ver logs
docker-compose logs -f app
```

### 3. Verificar Status
```bash
# Status dos containers
docker-compose ps

# Health check
docker-compose exec app curl http://localhost:3333/health
```

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
# Usar docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up
```

### Produção
```bash
# Usar docker-compose.yml (padrão)
docker-compose up -d
```

### Manutenção
```bash
# Executar migrations
docker-compose exec app npx prisma migrate deploy

# Backup do banco
docker-compose exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql

# Restore do banco
docker-compose exec -T db psql -U $POSTGRES_USER $POSTGRES_DB < backup.sql
```

## 📊 Monitoramento

### Logs
```bash
# Logs da aplicação
docker-compose logs -f app

# Logs do banco
docker-compose logs -f db

# Logs de todos os serviços
docker-compose logs -f
```

### Métricas
```bash
# Uso de recursos
docker stats

# Espaço em disco
docker system df
```

## 🌐 Configuração de Rede

### Rede Existente
O projeto está configurado para usar a rede `barber_evolution_net` que já existe no servidor.

### Portas Configuradas
- **Aplicação:** `3333` (configurável via variável `PORT`)
- **Banco de Dados:** `5434` (configurável via variável `POSTGRES_EXTERNAL_PORT`)
- **Banco Evolution API:** `5433` (já em uso)

### Verificar Rede
```bash
# Listar redes disponíveis
docker network ls

# Verificar containers na rede
docker network inspect barber_evolution_net
```

## 🔒 Segurança

### Checklist de Produção
- [ ] Senhas fortes configuradas
- [ ] JWT secrets únicos e seguros
- [ ] CORS configurado corretamente
- [ ] Rate limiting ativado
- [ ] HTTPS configurado (se aplicável)
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
- [ ] Logs centralizados

## 📝 Notas Importantes

### Variáveis Obrigatórias
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` - Configuração do banco
- `JWT_SECRET_PUBLIC_KEY`, `JWT_SECRET_PRIVATE_KEY` - Segurança JWT
- `DATABASE_URL` - URL de conexão com o banco

### Variáveis Opcionais
- `MCP_SERVER_URL`, `MCP_SERVER_PATH` - Apenas se usar MCP
- `EVOLUTION_API_KEY`, `EVOLUTION_API_URL` - Apenas se usar Evolution API
- `DEEPSEEK_API_KEY` - Apenas se usar Deepseek AI
- `PROMPT_JSON_PATH` - Não é mais necessário (prompt embutido no código)

### Configurações de Email
Configure as variáveis de email apenas se a funcionalidade de email estiver sendo utilizada no projeto.

### Conflitos de Porta
- O banco de dados do Barber Shop Manager usa a porta `5434` para evitar conflito com o Evolution API na porta `5433`
- A aplicação usa a porta `3333` por padrão

### Volumes
- **Banco de Dados:** Volume persistente `data_barber_shop_manager_backend` para dados do PostgreSQL
- **Uploads:** Não configurado neste momento (pode ser adicionado posteriormente se necessário) 