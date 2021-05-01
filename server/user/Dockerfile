FROM node:latest

COPY . /src

WORKDIR /src

COPY package*.json ./
                                                         
RUN npm install bcrypt@latest --save
RUN npm install --production

EXPOSE 3035

CMD npm start