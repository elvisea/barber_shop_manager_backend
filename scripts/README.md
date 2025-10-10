# 📜 Scripts de Inicialização

Este diretório contém scripts para inicializar a aplicação em diferentes ambientes.

## 🚀 Scripts Disponíveis

### `start-dev.sh`
Script para ambiente de **desenvolvimento**:
- Gera cliente Prisma
- Executa migrações
- Inicia aplicação com hot reload

### `start-prod.sh`
Script para ambiente de **produção**:
- Executa migrações
- Inicia aplicação compilada

## 🔧 Como Usar

### Desenvolvimento
```bash
# Local
./scripts/start-dev.sh

# Docker
docker-compose -f docker-compose.dev.yml up
```

### Produção
```bash
# Local
./scripts/start-prod.sh

# Docker
docker-compose -f docker-compose.yml up
```

## ⚙️ Configuração

Os scripts são automaticamente tornados executáveis nos Dockerfiles:
- `Dockerfile.dev`: Inclui `chmod +x scripts/start-dev.sh`
- `Dockerfile`: Não usa scripts (executa diretamente)

## 🛠️ Manutenção

Para adicionar novos scripts:
1. Criar arquivo `.sh` no diretório `scripts/`
2. Tornar executável: `chmod +x scripts/nome-do-script.sh`
3. Adicionar `RUN chmod +x scripts/nome-do-script.sh` no Dockerfile se necessário
4. Atualizar este README