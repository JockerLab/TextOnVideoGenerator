FROM node:18-alpine

WORKDIR /app

COPY ./fonts ./
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

RUN mkdir -p /usr/share/fonts/truetype
RUN install -m644 ./*.ttf /usr/share/fonts/truetype/
RUN rm ./*.ttf
RUN apk add --no-cache ffmpeg
RUN npm install
RUN npm run build

EXPOSE 80/tcp

CMD ["npm", "run", "start"]
