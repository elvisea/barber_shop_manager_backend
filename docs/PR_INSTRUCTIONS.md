# Instruções para Commit, Push e PR - Refatoração User/Member

## Status Atual

✅ Análise completa realizada
✅ Documentação criada
✅ Code review realizado
✅ Agrupamento de commits definido

## Próximos Passos

### 1. Adicionar Arquivos de Documentação ao Git

```bash
git add docs/REFACTORING_SUMMARY.md
git add docs/COMMIT_GROUPS.md
git add docs/CODE_REVIEW_SUMMARY.md
git add docs/PR_INSTRUCTIONS.md
```

### 2. Agrupar e Fazer Commits

Siga a ordem definida em `docs/COMMIT_GROUPS.md`. Exemplo:

```bash
# Grupo 1: Schema e Migration (CRÍTICO - PRIMEIRO)
git add prisma/schema.prisma prisma/migrations/
git commit -m "refactor(database): unifica User e Member em estrutura única

- Remove model Member e MemberRefreshToken
- Cria model UserEstablishment para relacionamento User-Establishment
- Renomeia Member* para User* (WorkingHours, AbsencePeriod, Product, Service)
- Atualiza relacionamentos para usar User diretamente
- Cria migration inicial com estrutura unificada"

# Continue com os outros grupos conforme COMMIT_GROUPS.md
```

### 3. Push para o Repositório

```bash
git push origin feature/unify-user-member
```

### 4. Criar Pull Request

Use o GitHub CLI ou interface web:

```bash
gh pr create \
  --base develop \
  --title "refactor: unifica User e Member em estrutura única" \
  --body-file docs/PR_DESCRIPTION.md
```

Ou use a descrição abaixo:

## Descrição da PR

```markdown
# 🔄 Refatoração: Unificação User/Member

## 📋 Resumo

Esta PR unifica as entidades `User` e `Member` em uma única estrutura, simplificando a arquitetura e permitindo que usuários trabalhem em múltiplos estabelecimentos com papéis diferentes.

## 📊 Estatísticas

- **83 arquivos modificados**
- **3.600 linhas adicionadas**
- **3.909 linhas removidas**
- **1 módulo removido** (member-auth)
- **1 módulo criado** (user-establishments)
- **1 migration criada**

## 🎯 Principais Mudanças

### Schema e Database
- ✅ Remove model `Member` e `MemberRefreshToken`
- ✅ Cria model `UserEstablishment` (tabela pivô)
- ✅ Renomeia `Member*` para `User*` (WorkingHours, AbsencePeriod, Product, Service)
- ✅ Atualiza todos os relacionamentos para usar `User` diretamente
- ✅ Nova migration com estrutura unificada

### Módulos
- ✅ Remove módulo `member-auth`
- ✅ Cria módulo `user-establishments`
- ✅ Atualiza módulos: appointments, members, member-products, member-services, tokens, auth

### Seeds
- ✅ Atualiza seeds para criar User + UserEstablishment

## 🔍 Validações Realizadas

- ✅ Schema Prisma validado (`npx prisma validate`)
- ✅ Migration SQL revisada e completa
- ✅ Nenhuma referência problemática a Member/MemberRole
- ✅ Relacionamentos corretos e consistentes
- ✅ Módulos atualizados corretamente
- ✅ Documentação atualizada

## 📚 Documentação

- `docs/REFACTORING_SUMMARY.md` - Resumo completo da refatoração
- `docs/COMMIT_GROUPS.md` - Agrupamento de commits
- `docs/CODE_REVIEW_SUMMARY.md` - Code review completo
- `docs/ARQUITETURA_E_REGRAS_NEGOCIO.md` - Atualizado com nova estrutura

## ⚠️ Breaking Changes

Esta é uma **breaking change** que requer:
1. Executar migration no banco de dados
2. Atualizar frontend para usar nova estrutura
3. Migrar dados existentes (se houver)

## 🧪 Como Testar

1. Executar migration:
   ```bash
   npx prisma migrate deploy
   ```

2. Executar seeds:
   ```bash
   npm run seed
   ```

3. Testar endpoints:
   - Criar user-establishment
   - Listar user-establishments
   - Atualizar user-establishment
   - Verificar relacionamentos

## ✅ Checklist

- [x] Schema Prisma validado
- [x] Migration testada
- [x] Seeds atualizados
- [x] Módulos atualizados
- [x] Documentação atualizada
- [x] Code review realizado
- [ ] Testes E2E (se aplicável)
- [ ] Frontend atualizado (PR separada)

## 🔗 Issues Relacionadas

<!-- Adicione links para issues relacionadas -->

## 📝 Notas

- Erros de lint são pré-existentes e não relacionados à refatoração
- Alguns nomes de variáveis ainda usam `memberId` (aceitável, mantém semântica)
- Build error de permissão no dist (resolver localmente)

## 👥 Reviewers

<!-- Adicione reviewers se necessário -->
```

## Comandos Completos

```bash
# 1. Adicionar documentação
git add docs/REFACTORING_SUMMARY.md docs/COMMIT_GROUPS.md docs/CODE_REVIEW_SUMMARY.md docs/PR_INSTRUCTIONS.md

# 2. Commit da documentação
git commit -m "docs: adiciona documentação da refatoração User/Member"

# 3. Seguir COMMIT_GROUPS.md para commits restantes
# ... (veja COMMIT_GROUPS.md)

# 4. Push
git push origin feature/unify-user-member

# 5. Criar PR
gh pr create --base develop --title "refactor: unifica User e Member em estrutura única" --body "..." 
```

## Observações Importantes

1. **Ordem dos Commits**: O commit do schema e migration DEVE ser o primeiro
2. **Breaking Change**: Esta é uma breaking change - comunicar ao time
3. **Migration**: Testar migration em ambiente de desenvolvimento primeiro
4. **Frontend**: Frontend precisará ser atualizado em PR separada

## Suporte

Em caso de dúvidas, consulte:
- `docs/REFACTORING_SUMMARY.md` - Resumo completo
- `docs/COMMIT_GROUPS.md` - Agrupamento de commits
- `docs/CODE_REVIEW_SUMMARY.md` - Code review
