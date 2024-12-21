FROM node:16.15-alpine3.16
# RUN npm install
WORKDIR /app
COPY package*.json ./
COPY ./patches ./patches
# RUN npm install && npm run postinstall
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]