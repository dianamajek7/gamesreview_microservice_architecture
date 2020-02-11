FROM node:latest

COPY . /src

WORKDIR /src

COPY package*.json ./

RUN npm install --production

EXPOSE 3031

CMD npm start