# 📤 Importando Rotas para o Postman

Este documento explica como usar os arquivos YAML gerados para criar coleções no Postman.

## 🚀 Importando routes.yaml (Recomendado)

### Passo 1: Abrir Postman
1. Abra o Postman
2. Clique em "Import" no canto superior esquerdo

### Passo 2: Importar arquivo
1. Clique na aba "File"
2. Selecione o arquivo `docs/routes.yaml`
3. Clique em "Import"

### Passo 3: Configurar variáveis
Após a importação, configure as variáveis de ambiente:

```json
{
  "base_url": "http://localhost:3333",
  "auth_token": "seu_jwt_token_aqui"
}
```

### Passo 4: Configurar autenticação
1. Vá em "Collection" > "Edit"
2. Na aba "Authorization"
3. Selecione "Bearer Token"
4. Em "Token", digite: `{{auth_token}}`

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente
```json
{
  "base_url": "http://localhost:3333",
  "auth_token": "",
  "establishment_id": "1",
  "user_id": "1"
}
```

### Variáveis de Coleção
```json
{
  "base_url": "{{base_url}}",
  "auth_token": "{{auth_token}}"
}
```

## 📝 Exemplos de Uso

### 1. Login
```bash
POST {{base_url}}/user-auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Criar Estabelecimento
```bash
POST {{base_url}}/establishments
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "name": "Barbearia Exemplo",
  "address": "Rua Exemplo, 123",
  "phone": "+5511999999999"
}
```

### 3. Listar Clientes
```bash
GET {{base_url}}/establishments/{{establishment_id}}/customers
Authorization: Bearer {{auth_token}}
```

## 🛠️ Scripts de Pré-request

### Script para extrair token do login
```javascript
// Adicione este script no request de login
pm.test("Extract token", function () {
    var jsonData = pm.response.json();
    pm.environment.set("auth_token", jsonData.access_token);
});
```

### Script para validar resposta
```javascript
// Script para validar status 200/201
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

## 🔄 Atualização Automática

Para manter a coleção sempre atualizada:

1. **Gere os arquivos YAML:**
```bash
npm run docs:generate-all
```

2. **Re-importe no Postman:**
   - Delete a coleção antiga
   - Importe o novo `routes.yaml`

3. **Configure novamente as variáveis de ambiente**

## 📊 Estrutura da Coleção

A coleção será organizada por tags:

- **Authentication**
  - POST /user-auth/login

- **Users**
  - POST /users

- **Establishments**
  - POST /establishments
  - GET /establishments
  - GET /establishments/:id
  - DELETE /establishments/:id

- **Establishment Customers**
  - POST /establishments/:establishmentId/customers
  - GET /establishments/:establishmentId/customers
  - GET /establishments/:establishmentId/customers/:id
  - PUT /establishments/:establishmentId/customers/:id
  - DELETE /establishments/:establishmentId/customers/:id

- **Members**
  - POST /establishments/:establishmentId/members
  - GET /establishments/:establishmentId/members
  - GET /establishments/:establishmentId/members/:id
  - PUT /establishments/:establishmentId/members/:id
  - DELETE /establishments/:establishmentId/members/:id

- **Plans**
  - POST /plans
  - GET /plans
  - GET /plans/:id
  - PUT /plans/:id
  - DELETE /plans/:id

- **Subscriptions**
  - POST /subscriptions
  - GET /subscriptions
  - GET /subscriptions/:id
  - PUT /subscriptions/:id
  - DELETE /subscriptions/:id

- **Webhook**
  - POST /api/webhook

## 🐛 Troubleshooting

### Erro: "Invalid OpenAPI specification"
- Verifique se o arquivo YAML está válido
- Execute `npm run docs:generate` novamente

### Erro: "Authorization failed"
- Verifique se o token está correto
- Faça login novamente para obter um novo token

### Erro: "Base URL not found"
- Configure a variável `base_url` no ambiente
- Verifique se o servidor está rodando

## 📞 Suporte

Para problemas específicos:
1. Verifique se o servidor está rodando
2. Confirme se as variáveis de ambiente estão configuradas
3. Teste primeiro o endpoint de login
4. Verifique os logs do servidor para erros 