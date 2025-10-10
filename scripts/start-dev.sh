#!/bin/bash

# ===========================================
# BARBER SHOP MANAGER - SCRIPT DE DESENVOLVIMENTO
# ===========================================
# Este script inicia a aplicação em modo de desenvolvimento
# Executa: Prisma Generate → Migrate Deploy → Start Dev

set -e  # Para a execução em caso de erro

echo "🚀 Iniciando Barber Shop Manager - Modo Desenvolvimento"
echo "=================================================="

# ===========================================
# 1. GERAR CLIENTE PRISMA
# ===========================================
echo "📦 Gerando cliente Prisma..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Cliente Prisma gerado com sucesso"
else
    echo "❌ Erro ao gerar cliente Prisma"
    exit 1
fi

# ===========================================
# 2. EXECUTAR MIGRAÇÕES
# ===========================================
echo "🗄️  Executando migrações do banco de dados..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Migrações executadas com sucesso"
else
    echo "❌ Erro ao executar migrações"
    exit 1
fi

# ===========================================
# 3. INICIAR APLICAÇÃO EM MODO DESENVOLVIMENTO
# ===========================================
echo "🎯 Iniciando aplicação em modo desenvolvimento..."
echo "=================================================="

npm run start:dev
