FROM node:10-alpine

RUN apk update

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "run", "dev"]