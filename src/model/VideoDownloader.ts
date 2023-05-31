import * as fs from 'fs';
import ytdl from 'ytdl-core';
import { OUTPUT_PATH, DOWNLOADED_PATH } from '../constants';
import { BotError } from '../error/BotError';
import { LRUCache } from '../service/LRUCache';

export class VideoDownloader {
    static async download(
        cache: LRUCache, // todo: interface
        outputName: string,
        link: string,
        onDownload: (videoPath: string) => void
    ) {
        if (!ytdl.validateURL(link)) {
            throw new BotError('Invalid video URL.');
        }

        const info = await ytdl.getInfo(link);
        if (+info.videoDetails.lengthSeconds > 60 * 60 * 3) {
            throw new BotError('Video duration cannot be more than 3 hours.');
        }

        const videoPath = DOWNLOADED_PATH + outputName;
        
        if (!fs.existsSync(DOWNLOADED_PATH)){
            fs.mkdirSync(DOWNLOADED_PATH, { recursive: true });
        }

        if (!fs.existsSync(OUTPUT_PATH)){
            fs.mkdirSync(OUTPUT_PATH, { recursive: true });
        }

        if (!cache.has(outputName)) {
            cache.put(outputName);
            ytdl(link, { quality: 'lowest' })
                .on('end', () => {
                    console.log(`Video ${outputName} downloaded!`);
                    onDownload(videoPath);
                })
                .pipe(fs.createWriteStream(videoPath));
        } else {
            onDownload(videoPath); 
        }
    }
}