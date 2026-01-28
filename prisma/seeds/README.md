# 🌱 Sistema de Seeds - Barber Shop Manager

Este diretório contém o sistema de seeds para popular o banco de dados com dados de exemplo para desenvolvimento e testes.

## 📁 Estrutura

```
prisma/seeds/
├── index.ts                    # Script principal de seed
├── data/                       # Dados específicos por entidade
│   ├── users.ts               # Usuários (root + owners)
│   ├── establishments.ts      # Estabelecimentos (2 por owner)
│   ├── members.ts             # Membros/funcionários (6 por estabelecimento)
│   ├── member-customizations.ts # UserService + UserProduct para barbeiros
│   ├── services.ts            # Serviços (15 por estabelecimento)
│   ├── products.ts            # Produtos (15 por estabelecimento)
│   ├── customers.ts           # Clientes (15 por estabelecimento)
│   └── templates/             # Listas reutilizáveis (importadas onde necessário)
│       ├── product-templates.ts  # PRODUCT_TEMPLATES
│       ├── service-templates.ts  # SERVICE_TEMPLATES
│       ├── fake-cpf-pool.ts      # FAKE_CPF_POOL
│       ├── brazilian-names.ts    # FIRST_NAMES, LAST_NAMES
│       ├── brazilian-address.ts  # STREETS, NEIGHBORHOODS
│       ├── establishment-names.ts # ESTABLISHMENT_PREFIXES, ESTABLISHMENT_SUFFIXES
│       └── durations.ts          # DURATIONS
├── utils/
│   ├── hash-password.ts       # Hash de senhas
│   ├── generate-data.ts       # Geradores de dados realistas
│   ├── phone-e164.ts          # Telefones E.164 (BR)
│   ├── encrypt.ts             # Criptografia de documentos (CPF)
│   └── validation.ts          # Validações e limpeza
└── README.md                  # Esta documentação
```

## 🚀 Como usar

### Executar seeds
```bash
npm run seed
```

### Executar seeds com limpeza forçada
```bash
npm run seed:reset
```

## 📊 Dados gerados

### Usuários (3)
- **ROOT**: root@barbershopmanager.com.br
- **OWNER 1**: owner1@barbershopmanager.com.br
- **OWNER 2**: owner2@barbershopmanager.com.br
- **Senha**: valor da variável de ambiente `SEED_PASSWORD`

### Estabelecimentos (4)
- 2 por owner (apenas usuários OWNER)
- Nomes e endereços realistas; telefones no formato E.164

### Membros / Funcionários (24)
- 6 por estabelecimento: 2 RECEPTIONIST, 2 HAIRDRESSER, 2 BARBER
- Cada membro é um User + UserEstablishment
- Emails: `{role}-{índice}-est-{estabelecimento}@barbershopmanager.com.br`
- Telefones E.164 únicos; senha = SEED_PASSWORD

### Serviços (60)
- 15 por estabelecimento (SERVICE_TEMPLATES)
- Corte, barba, progressiva, coloração, etc.
- Preços em centavos; duração em minutos; comissão padrão 15%

### Produtos (60)
- 15 por estabelecimento (PRODUCT_TEMPLATES)
- Pomadas, shampoos, ceras, máscaras, etc.
- Comissão padrão 10%; estoque 100

### Clientes (60)
- 15 por estabelecimento
- Emails: `cliente-{índice}-est-{estabelecimento}@barbershopmanager.com.br`
- Telefones E.164 únicos; nomes brasileiros

### Customizações (barbeiros)
- Para cada usuário BARBER: 15 UserService + 15 UserProduct
- Valores copiados dos serviços e produtos do estabelecimento
- Total: 8 barbeiros × 15 = 120 UserService e 120 UserProduct

## 🔧 Configuração

### Variáveis de ambiente obrigatórias
```env
DATABASE_URL="postgresql://user:password@localhost:5432/barber_shop_manager"
ENCRYPTION_KEY="sua_chave_32_bytes_hex_ou_string"
SEED_PASSWORD="sua_senha_para_usuarios_seed"
```

- **SEED_PASSWORD**: usada por todos os usuários criados no seed (root, owners, funcionários). Não expor em produção.
- **ENCRYPTION_KEY**: usada para criptografar CPF/documento (32 bytes em hex ou string).
- **DATABASE_URL**: conexão com PostgreSQL.

### Formato de dados
- **Emails**: domínio `@barbershopmanager.com.br`
- **Telefones**: padrão E.164 (ex.: +5511999999001)

## ⚠️ Avisos

- **CUIDADO**: O comando `seed:reset` limpa TODOS os dados do banco.
- **SEED_PASSWORD** é obrigatória; o seed falha se não estiver definida.
- Dados são gerados com telefones e emails únicos para evitar conflitos de constraint.

## 🛠️ Desenvolvimento

### Adicionar novos dados
1. Crie um novo arquivo em `data/` ou estenda os existentes.
2. Siga o padrão: funções que recebem dados já criados (ex.: establishments) e retornam dados para criação.
3. Importe e orquestre no `index.ts` na ordem correta (respeitando foreign keys).

### Modificar dados existentes
1. Edite o arquivo correspondente em `data/`.
2. Execute `npm run seed:reset` para limpar e recriar.

## 📝 Logs

O sistema gera logs durante a execução:
- ✅ Contagem de registros criados por etapa
- 📊 Resumo final e credenciais (emails dos usuários; senha = SEED_PASSWORD)
- ❌ Erros e falhas (ex.: SEED_PASSWORD ou ENCRYPTION_KEY ausentes)
