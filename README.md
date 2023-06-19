### Install
Install ffmpeg:
```bash
sudo apt install ffmpeg
```
Install packages:
```bash
npm run install
```
Setup environment variables in `.env` file at the root of project.
```
BOT_TOKEN=<telegram_bot_token>
MAX_LIMIT=<cache_limit>
PORT=<server_port>
```

Build and start bot:
```bash
npm run build-and-start
```
### Docker
Build container image:
```bash
docker build -t text-on-video-bot .
```
Start container:
```bash
docker run -dp 127.0.0.1:3000:3000 text-on-video-bot
```
### Todo
- [ ] Data validation
- [ ] Fix width of text
- [ ] Load own video feature
