FROM node:18

WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/index.js"]
