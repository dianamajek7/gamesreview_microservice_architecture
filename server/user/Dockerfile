FROM node:latest

COPY . /src

WORKDIR /src

COPY package*.json ./

RUN npm install --production

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3035

CMD npm start