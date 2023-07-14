FROM node

WORKDIR /contacts

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node","server.js"]
