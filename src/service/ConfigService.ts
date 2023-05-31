import { IConfigService } from "../interface/IConfigService";
import dotenv from 'dotenv';

export class ConfigService implements IConfigService {
    constructor() {
        dotenv.config();
    }

    get(key: string): string | undefined {
        return process.env[key];
    }
}