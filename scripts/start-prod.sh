#!/bin/bash

# ===========================================
# BARBER SHOP MANAGER - SCRIPT DE PRODUÇÃO
# ===========================================
# Este script inicia a aplicação em modo de produção
# Executa: Migrate Deploy → Start Production

set -e  # Para a execução em caso de erro

echo "🚀 Iniciando Barber Shop Manager - Modo Produção"
echo "=============================================="

# ===========================================
# 1. EXECUTAR MIGRAÇÕES
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
# 2. INICIAR APLICAÇÃO EM MODO PRODUÇÃO
# ===========================================
echo "🎯 Iniciando aplicação em modo produção..."
echo "=============================================="

node dist/src/main.js
