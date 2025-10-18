# Dockerfile otimizado para Railway
FROM node:20-alpine AS builder

# Instalar dependências do sistema
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --include=dev

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage de produção
FROM node:20-alpine AS production

# Instalar dependências do sistema
RUN apk add --no-cache openssl bash

WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Expor porta
ENV PORT=3000
EXPOSE 3000

# Comando de inicialização
CMD ["bash", "scripts/start-production.sh"]
