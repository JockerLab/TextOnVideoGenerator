import express, { Express, Request, Response } from 'express';
import { IConfigService } from './interface/IConfigService';
import * as fs from 'fs';
import { DOWNLOADED_PATH, OUTPUT_PATH } from './constants';

const DEFAULT_PORT = 3000;

export class Server {
    private app: Express;
    private port: number;
    
    constructor(config: IConfigService) {
        this.app = express();
        this.port = +(config.get('PORT') ?? DEFAULT_PORT);
    }

    init() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('OK');
        });
        
        this.app.listen(this.port, () => {
            console.log('Server is running');
        });

        if (!fs.existsSync(DOWNLOADED_PATH)){
            fs.mkdirSync(DOWNLOADED_PATH, { recursive: true });
        }

        if (!fs.existsSync(OUTPUT_PATH)){
            fs.mkdirSync(OUTPUT_PATH, { recursive: true });
        }
    }
}
