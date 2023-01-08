FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build:src

EXPOSE 3000

CMD [ "npm", "start" ]
