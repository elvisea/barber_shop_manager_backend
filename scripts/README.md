# 🚀 Gerador de Documentação Swagger

Este script automatiza a criação de documentação Swagger padronizada para novos módulos do projeto, seguindo os padrões estabelecidos no módulo de appointments.

## 📋 Funcionalidades

- ✅ **Geração automática** de decorators compostos para Swagger
- ✅ **Templates padronizados** para todas as operações CRUD
- ✅ **Validação de parâmetros** de entrada
- ✅ **Geração automática** do arquivo `index.ts`
- ✅ **Suporte a ações personalizadas**
- ✅ **Validação de módulos existentes**

## 🗂️ Estrutura Gerada

```
src/modules/<módulo>/
├── docs/
│   ├── create-<entidade>.docs.ts
│   ├── find-all-<entidade>s.docs.ts
│   ├── find-<entidade>-by-id.docs.ts
│   ├── update-<entidade>.docs.ts
│   ├── delete-<entidade>.docs.ts
│   └── index.ts
```

## 🔧 Uso

### Comando Básico

```bash
npm run generate-docs -- --module=<módulo> --entity=<entidade>
```

### Exemplos

```bash
# Gerar documentação completa para módulo users
npm run generate-docs -- --module=users --entity=user

# Gerar documentação para módulo products
npm run generate-docs -- --module=products --entity=product

# Gerar apenas operações específicas
npm run generate-docs -- --module=orders --entity=order --actions=create,find-all

# Gerar para módulo com hífens
npm run generate-docs -- --module=user-profiles --entity=profile
```

### Parâmetros

| Parâmetro | Obrigatório | Descrição | Exemplo |
|-----------|-------------|-----------|---------|
| `--module` | ✅ | Nome do módulo (kebab-case) | `users`, `user-profiles` |
| `--entity` | ✅ | Nome da entidade (kebab-case) | `user`, `profile` |
| `--actions` | ❌ | Ações específicas (separadas por vírgula) | `create,find-all,update` |

### Ações Disponíveis

- `create` - Criação de entidade
- `find-all` - Listagem com paginação
- `find-by-id` - Busca por ID
- `update` - Atualização de entidade
- `delete` - Exclusão de entidade

## 📝 Templates Incluídos

### 1. Create Entity (`create-entity.docs.ts.template`)
- Documentação para endpoint POST
- Validações de entrada
- Respostas de sucesso e erro
- Autenticação e autorização

### 2. Find All (`find-entity.docs.ts.template`)
- Documentação para endpoint GET com paginação
- Parâmetros de consulta
- Resposta paginada
- Filtros de busca

### 3. Find By ID (`find-entity-by-id.docs.ts.template`)
- Documentação para endpoint GET /:id
- Parâmetro de ID
- Resposta de entidade única

### 4. Update Entity (`update-entity.docs.ts.template`)
- Documentação para endpoint PUT /:id
- Validações de atualização
- Resposta de entidade atualizada

### 5. Delete Entity (`delete-entity.docs.ts.template`)
- Documentação para endpoint DELETE /:id
- Resposta de sucesso (204 No Content)
- Validações de autorização

## 🎯 Padrões Seguidos

### Nomenclatura
- **Módulos**: `kebab-case` (ex: `user-profiles`)
- **Entidades**: `kebab-case` (ex: `user-profile`)
- **Classes**: `PascalCase` (ex: `UserProfile`)
- **Funções**: `camelCase` (ex: `createUserProfile`)

### Estrutura de Arquivos
- **Decorators**: `create-<entidade>.docs.ts`
- **Funções**: `Create<Entidade>Docs()`
- **Imports**: DTOs da pasta `../dtos/api/`

### Validações Incluídas
- ✅ **400 Bad Request** - Dados inválidos
- ✅ **401 Unauthorized** - Token inválido
- ✅ **403 Forbidden** - Acesso negado
- ✅ **404 Not Found** - Recurso não encontrado
- ✅ **409 Conflict** - Conflito de dados

## 🔄 Fluxo de Trabalho

1. **Execute o script** com os parâmetros desejados
2. **Verifique os arquivos** gerados na pasta `docs/`
3. **Ajuste os DTOs** conforme necessário
4. **Importe os decorators** nos controllers
5. **Teste a documentação** no Swagger UI

## 📚 Exemplo Completo

```bash
# 1. Gerar documentação
npm run generate-docs -- --module=products --entity=product

# 2. Arquivos gerados em src/modules/products/docs/
#    - create-product.docs.ts
#    - find-all-products.docs.ts
#    - find-product-by-id.docs.ts
#    - update-product.docs.ts
#    - delete-product.docs.ts
#    - index.ts

# 3. Usar nos controllers
import { CreateProductDocs } from './docs';

@Controller('products')
export class ProductController {
  @Post()
  @CreateProductDocs()
  create() {
    // implementação
  }
}
```

## ⚠️ Validações

### Módulo
- Deve existir em `src/modules/<módulo>/`
- Nome deve conter apenas letras minúsculas, números e hífens

### Entidade
- Nome deve conter apenas letras minúsculas, números e hífens
- Será convertido para PascalCase nas classes

### Ações
- Devem ser válidas (create, find-all, find-by-id, update, delete)
- Separadas por vírgula sem espaços

## 🐛 Troubleshooting

### Erro: "Módulo não encontrado"
- Verifique se o módulo existe em `src/modules/`
- Confirme o nome do módulo (case-sensitive)

### Erro: "Template não encontrado"
- Verifique se os templates existem em `scripts/templates/`
- Confirme se a ação é suportada

### Erro: "Nome inválido"
- Use apenas letras minúsculas, números e hífens
- Não use espaços ou caracteres especiais

## 🚀 Próximos Passos

Após gerar a documentação:

1. **Criar os DTOs** necessários em `dtos/api/`
2. **Implementar os controllers** com os decorators
3. **Testar no Swagger UI** em `http://localhost:3333/api`
4. **Ajustar conforme necessário** para casos específicos

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs de erro
2. Confirme os parâmetros de entrada
3. Teste com um módulo simples primeiro
4. Consulte os exemplos acima
