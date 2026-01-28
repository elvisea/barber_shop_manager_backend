#!/usr/bin/env bash
# Gera par de chaves RSA para JWT (RS256).
# As chaves são exibidas em base64 para uso em JWT_SECRET_PUBLIC_KEY e JWT_SECRET_PRIVATE_KEY.
#
# Uso: ./scripts/generate-jwt-keys.sh
# Ou:  bash scripts/generate-jwt-keys.sh

set -e

KEYS_DIR="${1:-./.jwt-keys}"
mkdir -p "$KEYS_DIR"

PRIVATE_PEM="$KEYS_DIR/private.pem"
PUBLIC_PEM="$KEYS_DIR/public.pem"

echo "Gerando chave privada RSA 2048 bits..."
openssl genrsa -out "$PRIVATE_PEM" 2048

echo "Gerando chave pública..."
openssl rsa -in "$PRIVATE_PEM" -pubout -out "$PUBLIC_PEM"

echo ""
echo "=============================================="
echo "Adicione estas linhas ao seu .env (valores em base64):"
echo "=============================================="
echo ""
echo "JWT_SECRET_PRIVATE_KEY=$(cat "$PRIVATE_PEM" | base64 | tr -d '\n')"
echo ""
echo "JWT_SECRET_PUBLIC_KEY=$(cat "$PUBLIC_PEM" | base64 | tr -d '\n')"
echo ""
echo "=============================================="
echo "Arquivos PEM salvos em: $KEYS_DIR"
echo "Adicione .jwt-keys/ ao .gitignore e não commite as chaves."
echo "=============================================="
