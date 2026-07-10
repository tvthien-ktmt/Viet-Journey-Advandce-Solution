FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

ENV DATABASE_URL=""

RUN npx prisma generate
RUN npx tsc

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
