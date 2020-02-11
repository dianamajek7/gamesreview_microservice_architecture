
# => Build container
FROM node:latest

COPY . /app

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install react-app-rewired@2.1.4 -g

ADD . .

RUN npm run build

EXPOSE 3000

COPY ./env.sh .
COPY .env .

RUN chmod +x env.sh
RUN ./env.sh

CMD npm start
