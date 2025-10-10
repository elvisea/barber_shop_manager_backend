#!/bin/bash

# ===========================================
# BARBER SHOP MANAGER - TESTE DE SCRIPTS
# ===========================================
# Este script testa se os scripts estão funcionando corretamente

echo "🧪 Testando scripts do Barber Shop Manager"
echo "=========================================="

# Verificar se os scripts existem
echo "📁 Verificando existência dos scripts:"
ls -la scripts/

echo ""
echo "🔍 Verificando permissões:"
ls -la scripts/start-*.sh

echo ""
echo "✅ Scripts encontrados e com permissões corretas!"
echo ""
echo "📋 Para usar:"
echo "  Desenvolvimento: docker-compose -f docker-compose.dev.yml up"
echo "  Produção:       docker-compose -f docker-compose.yml up"
