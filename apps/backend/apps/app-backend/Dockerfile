FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build app-backend

ENTRYPOINT ["npm", "run", "start-app-backend"]