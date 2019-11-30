FROM node:12.13-buster

COPY /services /app/services
COPY package*.json ./

RUN npm install
WORKDIR /app
EXPOSE 8000
CMD [ "node" , "services/main.js" ]