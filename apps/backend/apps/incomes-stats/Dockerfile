FROM node:22.13.1-alpine AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --no-cache netcat-openbsd dos2unix openssl && \
    npm install -g prisma && \
    yarn install --frozen-lockfile

COPY . .

ARG RABBIT_MQ_INCOMES_STATS_SERVICE_QUEUE
ENV RABBIT_MQ_INCOMES_STATS_SERVICE_QUEUE=$RABBIT_MQ_INCOMES_STATS_SERVICE_QUEUE

ARG RABBIT_MQ_URI
ENV RABBIT_MQ_URI=$RABBIT_MQ_URI

# Correction des fins de ligne et permissions
RUN dos2unix ./scripts/start.sh && \
    chmod +x ./scripts/start.sh

# Définir le point d'entrée
SHELL [ "/bin/sh", "-c" ]
ENTRYPOINT ["/bin/sh", "./scripts/start.sh"]

FROM node:22.13.1-alpine AS production

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

CMD ["node", "dist/apps/incomes-stats/main"]