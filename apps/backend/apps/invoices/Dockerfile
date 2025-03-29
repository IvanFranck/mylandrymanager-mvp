FROM node:22.13.1-alpine AS development

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --no-cache netcat-openbsd dos2unix openssl && \
    npm install -g prisma && \
    yarn install --frozen-lockfile

COPY . .

ARG RABBIT_MQ_CREATE_INVOICES_SERVICE_QUEUE
ENV RABBIT_MQ_CREATE_INVOICES_SERVICE_QUEUE=$RABBIT_MQ_CREATE_INVOICES_SERVICE_QUEUE

ARG RABBIT_MQ_URI
ENV RABBIT_MQ_URI=$RABBIT_MQ_URI

ARG CODE_SALT
ENV CODE_SALT=$CODE_SALT

ARG CODE_MIN_LENGTH
ENV CODE_MIN_LENGTH=$CODE_MIN_LENGTH

ARG CODE_ALPHABET
ENV CODE_ALPHABET=$CODE_ALPHABET

ARG S3_BUCKET_NAME
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME

ARG AWS_REGION
ENV AWS_REGION=$AWS_REGION

ARG AWS_SECRET_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

ARG AWS_ACCESS_KEY_ID
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID

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

CMD ["node", "dist/apps/invoices/main"]