FROM node:alpine AS development

# Installation des outils nécessaires
RUN apk add --no-cache netcat-openbsd dos2unix openssl

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g pnpm prisma

RUN pnpm install

COPY . .

# Correction des fins de ligne et permissions
RUN dos2unix ./scripts/start.sh && \
    chmod +x ./scripts/start.sh

EXPOSE ${PORT}

# Définir le point d'entrée
SHELL [ "/bin/sh", "-c" ]
ENTRYPOINT ["/bin/sh", "./scripts/start.sh"]

FROM node:alpine AS production

# Même chose pour la production
RUN apk add --no-cache openssl

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/app-backend/main"]