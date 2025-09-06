# --------------------------------------------
# Estágio de construção (Builder Stage)
# --------------------------------------------

FROM node:22.17.0-alpine AS builder

RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas as dependências (incluindo devDependencies para build)
RUN npm ci && npm cache clean --force

# Gerar cliente Prisma
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# --------------------------------------------
# Estágio de produção final
# --------------------------------------------
FROM node:22.17.0-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nestjs -u 1001

# Copiar arquivos necessários do builder
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Configurar ambiente
ENV NODE_ENV=production
ENV PORT=3333

# Expor porta
EXPOSE 3333

# Mudar para usuário não-root
USER nestjs

# Comando para produção
CMD ["node", "dist/src/main.js"]
