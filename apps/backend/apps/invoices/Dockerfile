FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY entrypoint.sh ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build invoices

ENTRYPOINT ["npm", "run", "start-invoices"]