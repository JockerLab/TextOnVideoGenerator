import { TextOnVideoBot } from './model/TextOnVideoBot';
import { Server } from './server';
import { ConfigService } from './service/ConfigService';
import { LRUCache } from './service/LRUCache';

// todo: сделать валидацию
// todo: пофиксить широкий текст?
// todo: добавить возможность загружать свои видео

const config = new ConfigService();
const server = new Server(config);
server.init();
const cache = new LRUCache(config);
const bot = new TextOnVideoBot(config, cache);
