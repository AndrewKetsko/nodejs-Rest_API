FROM node

<<<<<<< Updated upstream
WORKDIR /contacts
=======
<<<<<<< HEAD
WORKDIR /app
=======
WORKDIR /contacts
>>>>>>> 3b009ca3727fd30771782c60d9bd1a84966abeb8
>>>>>>> Stashed changes

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node","server.js"]
