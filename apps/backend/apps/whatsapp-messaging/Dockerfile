FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY entrypoint.sh ./

RUN npm install

COPY . .

RUN npm run build whatsapp-messaging

ENTRYPOINT ["npm", "run", "start-whatsapp-messaging"]