import * as fs from 'fs';
import ytdl from 'ytdl-core';
import { OUTPUT_PATH, DOWNLOADED_PATH } from './utils';

export class VideoDownloader {
    static download(
        outputName: string,
        link: string,
        onDownload: (videoPath: string) => void
    ) {
        if (!ytdl.validateURL(link)) {
            throw new Error('Invalid video URL.');
        }

        const videoPath = DOWNLOADED_PATH + outputName;
        
        if (!fs.existsSync(DOWNLOADED_PATH)){
            fs.mkdirSync(DOWNLOADED_PATH, { recursive: true });
        }

        if (!fs.existsSync(OUTPUT_PATH)){
            fs.mkdirSync(OUTPUT_PATH, { recursive: true });
        }

        if (!fs.existsSync(videoPath)) {
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