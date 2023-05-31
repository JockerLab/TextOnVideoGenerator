import { TextOnVideoBot } from './model/TextOnVideoBot';
import { ConfigService } from './service/ConfigService';
import { LRUCache } from './service/LRUCache';

// Ticket 4. todo: деплой
// todo: сделать валидацию
// todo: пофиксить широкий текст?

const config = new ConfigService();
const cache = new LRUCache(config);
const bot = new TextOnVideoBot(config, cache);