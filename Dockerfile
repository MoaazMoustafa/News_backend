FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g mocha

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]