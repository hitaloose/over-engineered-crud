FROM node:20

ARG NODE_ENV=production
ARG API_PORT=3000

ENV NODE_ENV=$NODE_ENV
ENV API_PORT=$API_PORT

WORKDIR /app
COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

EXPOSE $API_PORT

CMD ["npm", "start"]
