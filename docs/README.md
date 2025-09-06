# 📚 Documentação da API - Barber Shop Manager

Este diretório contém toda a documentação relacionada à API do sistema Barber Shop Manager.

## 📁 Estrutura de Documentação

### 🚀 **Geração de Documentação**
- **[README-routes-documentation.md](./README-routes-documentation.md)** - Guia completo para gerar documentação YAML das rotas
- **[routes.yaml](./routes.yaml)** - Documentação OpenAPI 3.0 completa (gerada automaticamente)

### 📊 **Resumos e Estatísticas**
- **[SUMMARY.md](./SUMMARY.md)** - Resumo técnico da implementação e estatísticas

### 🛠️ **Guias de Uso**
- **[import-to-postman.md](./import-to-postman.md)** - Como importar rotas para o Postman

## 🚀 **Início Rápido**

### Gerar Documentação
```bash
# Gerar documentação completa
npm run docs:generate

# Ou usar o comando alternativo
npm run docs:generate-all
```

### Usar no Postman
1. Execute `npm run docs:generate`
2. Abra o Postman
3. Importe o arquivo `docs/routes.yaml`
4. Siga o guia em [import-to-postman.md](./import-to-postman.md)

## 📋 **Comandos Disponíveis**

| Comando | Descrição |
|---------|-----------|
| `npm run docs:generate` | Gera documentação YAML completa |
| `npm run docs:generate-all` | Alias para docs:generate |

## 🔄 **Fluxo de Trabalho**

1. **Desenvolver** - Criar/modificar controllers com decorators Swagger
2. **Gerar** - Executar `npm run docs:generate`
3. **Usar** - Importar no Postman ou outras ferramentas
4. **Manter** - Atualizar quando necessário

## 📞 **Suporte**

Para problemas ou dúvidas:
- Consulte [README-routes-documentation.md](./README-routes-documentation.md) para detalhes técnicos
- Verifique [SUMMARY.md](./SUMMARY.md) para estatísticas e benefícios
- Use [import-to-postman.md](./import-to-postman.md) para integração com Postman

---

**💡 Dica:** Mantenha a documentação sempre atualizada executando `npm run docs:generate` após mudanças nos controllers.
