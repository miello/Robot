FROM node:12.13-buster



RUN npm install
EXPOSE 8000
CMD [ "node" , "/sevices/main.js"]