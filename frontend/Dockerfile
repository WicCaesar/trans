FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

RUN mkdir -p dist/ts

COPY . .

ENV HOST=0.0.0.0
ENV PORT=5000

EXPOSE 5000

CMD ["npm", "run", "start"] 