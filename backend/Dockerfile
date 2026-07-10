FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc
RUN mkdir -p uploads

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
