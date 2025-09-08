# 🌱 Sistema de Seeds - Barber Shop Manager

Este diretório contém o sistema de seeds para popular o banco de dados com dados de exemplo para desenvolvimento e testes.

## 📁 Estrutura

```
prisma/seeds/
├── index.ts                 # Script principal de seed
├── data/                    # Dados específicos por entidade
│   ├── users.ts            # Dados de usuários
│   ├── establishments.ts   # Dados de estabelecimentos
│   ├── members.ts          # Dados de membros
│   ├── services.ts         # Dados de serviços
│   ├── products.ts         # Dados de produtos
│   └── customers.ts        # Dados de clientes
├── utils/                   # Utilitários
│   ├── hash-password.ts    # Hash de senhas
│   ├── generate-data.ts    # Geradores de dados realistas
│   └── validation.ts       # Validações e limpeza
└── README.md               # Esta documentação
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

### Usuários (2)
- **OWNER**: owner@bytefulcode.tech
- **ROOT**: root@bytefulcode.tech
- **Senha**: Str0ngP@ssw0rd!

### Estabelecimentos (4)
- 2 para cada usuário
- Nomes realistas: "Barbearia do Centro", "Salão Premium", etc.

### Membros (12)
- 3 por estabelecimento (RECEPTIONIST, HAIRDRESSER, BARBER)
- Dados realistas com nomes brasileiros

### Serviços (24)
- 6 por estabelecimento
- Corte de cabelo, barba, sobrancelha, etc.
- Preços de R$ 15,00 a R$ 40,00

### Produtos (24)
- 6 por estabelecimento
- Pomadas, shampoos, óleos, etc.
- Preços de R$ 22,00 a R$ 40,00

### Clientes (20)
- 5 por estabelecimento
- Dados realistas com nomes brasileiros

### Associações
- 2 serviços por membro
- 2 produtos por membro
- Comissões configuradas

## 🔧 Configuração

### Variáveis de ambiente necessárias
```env
DATABASE_URL="postgresql://user:password@localhost:5432/barber_shop_manager"
```

### Dependências
- Prisma Client
- bcrypt (para hash de senhas)

## ⚠️ Avisos

- **CUIDADO**: O comando `seed:reset` limpa TODOS os dados do banco
- Os seeds são idempotentes - podem ser executados múltiplas vezes
- Dados são gerados de forma determinística para consistência

## 🛠️ Desenvolvimento

### Adicionar novos dados
1. Crie um novo arquivo em `data/`
2. Implemente a classe seguindo o padrão existente
3. Importe e use no `index.ts`

### Modificar dados existentes
1. Edite o arquivo correspondente em `data/`
2. Execute `npm run seed:reset` para limpar e recriar

## 📝 Logs

O sistema gera logs informativos durante a execução:
- ✅ Sucesso nas operações
- ⚠️ Avisos importantes
- ❌ Erros e falhas
- 📊 Resumo final dos dados criados
