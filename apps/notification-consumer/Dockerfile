# Builder
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate --schema=./apps/notification-consumer/prisma/schema.prisma
RUN npx nest build notification-consumer

# Production
FROM node:22-alpine AS production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/apps/notification-consumer/prisma ./prisma
COPY --from=builder /usr/src/app/apps/notification-consumer/entrypoint.sh .
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["node", "dist/apps/notification-consumer/main.js"]