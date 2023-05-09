import { TextOnVideoBot } from './model/TextOnVideoBot';
import { config } from 'dotenv';

// Ticket 4. todo: деплой
// todo: сделать обработку ошибок + валидация
// todo: добавить LRU кэш на видео
// todo: скачивать видео не длиннее X секунд.
// todo: COPY .env в Dockerfile убрать

const { error, parsed } = config();
if (error || !parsed) {
    throw Error('Config was not found!');
}
const bot = new TextOnVideoBot(parsed);