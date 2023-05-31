import { IConfigService } from "../interface/IConfigService";
import * as fs from 'fs';

export class LRUCache {
    private limit: number;
    private stack: string[];

    constructor(config: IConfigService) {
        this.limit = +(config.get('MAX_CACHE') ?? '0');
        this.stack = [];
        fs.readdirSync('./downloaded/').forEach(file => {
            this.stack.push(file);
        });
    }

    put(fileName: string): void {
        const posInStack = this.stack.findIndex((video) => video === fileName);
        if (this.stack.length >= this.limit) {
            const deleted = this.stack.splice(0, 1);
            try {
                fs.unlinkSync(`./downloaded/${deleted[0]}`);
                fs.unlinkSync(`./videos/${deleted[0]}`);
            } catch (err) {
                // ignore
            }
        }
        this.stack.push(fileName);
    }

    has(fileName: string): boolean {
        return this.stack.includes(fileName);
    }
}