FROM node:latest

COPY . /src

WORKDIR /src

COPY package*.json ./

RUN npm install --production

EXPOSE 3032

CMD npm start