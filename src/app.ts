import { TextOnVideoBot } from './model/TextOnVideoBot';
import { config } from 'dotenv';

// Ticket 4. todo: деплой
// todo: сделать обработку ошибок + валидация
// todo: добавить LRU кэш на видео
// todo: скачивать видео не длиннее X секунд.
// todo: COPY .env в Dockerfile убрать

const { error, parsed } = config();
const envVariable = {
    BOT_TOKEN: process.env.BOT_TOKEN ?? ""
};
if (error || (!parsed && !process.env.BOT_TOKEN)) {
    throw Error('Config was not found!');
}
const bot = new TextOnVideoBot((!parsed || !parsed['BOT_TOKEN']) ? envVariable : parsed);