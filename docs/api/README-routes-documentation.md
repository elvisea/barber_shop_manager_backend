# 📚 Documentação de Rotas - Barber Shop Manager

Este documento explica como gerar documentação YAML com todas as rotas da aplicação usando a estratégia Swagger nativa.

## 🚀 Scripts Disponíveis

### Geração via Swagger (Recomendado)
```bash
npm run docs:generate
```

**O que faz:**
- Usa a configuração do Swagger já existente
- Gera um arquivo `docs/routes.yaml` completo
- Inclui todos os metadados do Swagger (schemas, responses, etc.)
- Formato OpenAPI 3.0 padrão com referências
- Atualiza automaticamente com mudanças nos controllers

### Gerar Documentação Completa
```bash
npm run docs:generate-all
```

Gera a documentação completa (atualmente equivalente ao `docs:generate`).

## 📁 Arquivos Gerados

Após executar o script, você encontrará:

```
docs/
├── routes.yaml              # Documentação OpenAPI 3.0 completa
└── README-routes-documentation.md
```

## 📊 Exemplo de Saída

### routes.yaml (Swagger)
```yaml
openapi: 3.0.0
info:
  title: Barber Shop Manager
  description: Barber Shop Manager system API for barbershop management
  version: 1.0
paths:
  /api/user-auth/login:
    post:
      tags:
        - Authentication
      summary: Authenticate user and return tokens
      # ... mais detalhes
```

### Exemplo de Rota Documentada
```yaml
/api/user-auth/login:
  post:
    tags:
      - Authentication
    summary: Authenticate user and return tokens
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/UserLoginRequestDTO'
    responses:
      '200':
        description: Login successful
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserLoginResponseDTO'
```

## 🔧 Pré-requisitos

Antes de executar os scripts, instale as dependências:

```bash
npm install
```

## 🛠️ Como Funciona

### Script Swagger (`generate-routes-yaml.ts`)
1. Cria uma instância temporária da aplicação
2. Configura o Swagger igual ao `main.ts`
3. Gera o documento OpenAPI
4. Converte para YAML
5. Salva em `docs/routes.yaml`

### Como Funciona o Script
1. Cria uma instância temporária da aplicação NestJS
2. Configura o Swagger com as mesmas configurações do `main.ts`
3. Gera o documento OpenAPI usando `SwaggerModule.createDocument`
4. Converte para YAML usando `js-yaml`
5. Salva em `docs/routes.yaml`

## 📝 Uso dos Arquivos

### Para Desenvolvedores
- **routes.yaml**: Use para integração com ferramentas OpenAPI (Postman, Insomnia, Swagger UI)
- **Formato OpenAPI 3.0**: Padrão da indústria com referências organizadas
- **Schemas Completos**: Inclui todos os DTOs de request e response

### Para Ferramentas Externas
- **Postman**: Importe o `routes.yaml` diretamente
- **Insomnia**: Use o `routes.yaml` 
- **Swagger UI**: Use o `routes.yaml`
- **Outras ferramentas OpenAPI**: Compatível com qualquer ferramenta que suporte OpenAPI 3.0

## 🔄 Atualização Automática

Para manter a documentação sempre atualizada, você pode:

1. **Adicionar ao CI/CD:**
```yaml
- name: Generate Routes Documentation
  run: npm run docs:generate-all
```

2. **Hook de pre-commit:**
```bash
npm run docs:generate
git add docs/routes.yaml
```

## 🐛 Troubleshooting

### Erro: "Cannot find module 'js-yaml'"
```bash
npm install js-yaml @types/js-yaml
```

### Erro: "Cannot resolve module"
```bash
npm run build
npm run docs:generate
```

### Erro: "DiscoveryService not found"
Verifique se o `DiscoveryService` está importado corretamente no script.

## 📞 Suporte

Se encontrar problemas, verifique:
1. Se todas as dependências estão instaladas
2. Se a aplicação compila sem erros
3. Se os controllers estão decorados corretamente
4. Se o Swagger está configurado no `main.ts` 