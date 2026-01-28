# Scripts de Geração de Documentação

## Scripts Disponíveis

### 1. `docs:generate` (Principal)
**Comando**: `npm run docs:generate`

**Arquivo**: `scripts/generate-routes-yaml.ts`

**Funcionalidade**:
- Gera o arquivo `docs/api/routes.yaml` automaticamente
- Usa a configuração do Swagger da aplicação NestJS
- Captura todos os endpoints documentados com decorators Swagger
- Gera schemas completos de request/response
- Converte para formato OpenAPI 3.0.0 YAML

**Como funciona**:
1. Cria uma instância temporária da aplicação NestJS
2. Configura o Swagger com as mesmas configurações do `main.ts`
3. Gera o documento Swagger completo
4. Converte para YAML
5. Salva em `docs/api/routes.yaml`

**Status**: ✅ Funcionando e atualizado

**Observações**:
- O script encontra 27 rotas únicas (alguns controllers compartilham rotas)
- Total de 55 schemas gerados
- Arquivo gerado tem ~4192 linhas
- Usa a mesma configuração do `main.ts` (consistente)

### 2. `generate-docs` (Templates)
**Comando**: `npm run generate-docs -- --module=<módulo> --entity=<entidade>`

**Arquivo**: `scripts/generate-docs.js`

**Funcionalidade**:
- Gera templates de documentação Swagger para novos módulos
- Cria arquivos `.docs.ts` baseados em templates
- Útil para criar documentação de novos controllers rapidamente

**Status**: ✅ Funcionando (para criação de novos módulos)

## Comparação: Rotas Geradas vs Controllers

### Rotas Geradas pelo Script (27 rotas)
1. `/user-auth/login`
2. `/auth/password-reset`
3. `/auth/password-reset/verify`
4. `/auth/password-reset/confirm`
5. `/users`
6. `/users/email-verification/verify`
7. `/users/email-verification/resend`
8. `/establishments/{establishmentId}/members`
9. `/members/{memberId}`
10. `/members/email-verification/verify`
11. `/members/email-verification/resend`
12. `/members/{memberId}/summary`
13. `/establishments`
14. `/establishments/{establishmentId}`
15. `/establishments/{establishmentId}/evolution-api/instance`
16. `/establishments/{establishmentId}/customers`
17. `/customers/{customerId}`
18. `/establishments/{establishmentId}/products`
19. `/products/{productId}`
20. `/establishments/{establishmentId}/services`
21. `/services/{serviceId}`
22. `/plans`
23. `/plans/{id}`
24. `/establishments/{establishmentId}/subscriptions`
25. `/api/webhook`
26. `/establishments/{establishmentId}/appointments`
27. `/establishments/{establishmentId}/appointments/{appointmentId}`

### Por que menos rotas que controllers?

1. **Rotas agrupadas**: Alguns controllers compartilham a mesma rota base (ex: GET, POST, PUT, DELETE na mesma rota)
2. **Controllers não registrados**: Alguns controllers podem não estar no AppModule
3. **Rotas duplicadas**: Módulos `members` (legado) e `user-establishments` (novo) podem ter rotas similares
4. **Controllers sem decorators Swagger**: Controllers sem `@ApiTags` ou decorators de documentação não aparecem

## Como Usar

### Gerar routes.yaml completo
```bash
npm run docs:generate
```

### Gerar documentação para novo módulo
```bash
npm run generate-docs -- --module=novo-modulo --entity=entidade
```

## Verificações Realizadas

✅ Script `generate-routes-yaml.ts` está atualizado
✅ Usa mesma configuração do `main.ts`
✅ Gera arquivo YAML válido (OpenAPI 3.0.0)
✅ Captura todos os endpoints com documentação Swagger
✅ Schemas completos incluídos

## Recomendações

1. **Usar o script regularmente**: Execute `npm run docs:generate` após adicionar novos endpoints
2. **Verificar documentação**: Certifique-se de que todos os controllers têm `@ApiTags` e decorators de documentação
3. **Atualizar após mudanças**: Execute o script sempre que adicionar/modificar controllers
4. **Commit do arquivo gerado**: O `routes.yaml` deve ser versionado no git

## Status dos Scripts

| Script | Status | Última Verificação |
|--------|--------|-------------------|
| `docs:generate` | ✅ Funcionando | 28/01/2026 |
| `generate-docs` | ✅ Funcionando | 28/01/2026 |

## Conclusão

Os scripts estão **atualizados e funcionando corretamente**. O script `docs:generate` pode ser usado para recriar o arquivo `routes.yaml` sempre que necessário. Ele captura automaticamente todos os endpoints documentados com Swagger na aplicação.
