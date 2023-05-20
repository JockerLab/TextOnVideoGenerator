import { TextOnVideoBot } from './model/TextOnVideoBot';
import { config } from 'dotenv';

// Ticket 4. todo: деплой
// todo: сделать обработку ошибок + валидация
// todo: добавить LRU кэш на видео
// todo: скачивать видео не длиннее X секунд.
// todo: COPY .env в Dockerfile убрать

let { error, parsed } = config();
const { BOT_TOKEN, PORT, HOST } = process.env;
if (error) {
    throw Error('Config was not found!');
}
if (!parsed || !Object.keys(parsed).length) {
    parsed = {
        BOT_TOKEN: BOT_TOKEN ?? "",
        PORT: PORT ?? "",
        HOST: HOST ?? ""
    }
}
const bot = new TextOnVideoBot(parsed);