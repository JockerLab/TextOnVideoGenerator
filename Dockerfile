FROM node:18-alpine

WORKDIR /app

COPY ./fonts ./
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src
COPY .env ./

RUN mkdir -p /usr/share/fonts/truetype
RUN install -m644 ./*.ttf /usr/share/fonts/truetype/
RUN rm ./*.ttf
RUN apk add --no-cache ffmpeg
RUN npm install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]