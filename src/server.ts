import express, { Express, Request, Response } from 'express';
import { IConfigService } from './interface/IConfigService';

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
}
}
