FROM node:22-alpine3.19

RUN mkdir -p /app
WORKDIR /app

RUN npm install pm2 -g

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 9500
CMD ["pm2-runtime", "start", "pm2.config.js"]
