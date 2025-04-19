FROM node:18
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=3000
ENV DB_URL=<YOUR_DB_URL>
EXPOSE 3000
RUN npm run setup-db
CMD ["node", "server/index.js"]