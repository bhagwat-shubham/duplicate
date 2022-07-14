FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]