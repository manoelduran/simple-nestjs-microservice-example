#!/bin/sh

# Sai imediatamente se um comando falhar
set -e

# Executa o comando de migração do Prisma
echo "Running Consumer migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Inicia a aplicação principal (o que estava no CMD do Dockerfile)
echo "Starting Consumer..."
exec "$@"