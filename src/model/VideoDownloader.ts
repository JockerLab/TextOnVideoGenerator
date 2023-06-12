import ytdl from 'ytdl-core';
import { DOWNLOADED_PATH, TEMPORARY_PATH } from '../constants';
import { BotError } from '../error/BotError';
import { LRUCache } from '../service/LRUCache';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

export class VideoDownloader {
    static async download(
        cache: LRUCache, // todo: interface
        outputName: string,
        link: string,
        quality: string,
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
        const tempPath = TEMPORARY_PATH + outputName;

        if (!cache.has(outputName)) {
            cache.put(outputName);
            const audio = ytdl(link, {
                quality: quality === 'high' ? 'highestaudio' : 'lowestaudio'
            });
            const video = ytdl(link, {
                    quality: 'high' ? 'highestvideo' : 'lowestvideo'
                })
                .on('end', () => {
                    ffmpeg(tempPath)
                        .addInput(audio)
                        .addOptions(['-map 0:v', '-map 1:a', '-c:v copy', '-shortest'])
                        .on('error', error => console.log(error))
                        .on('end', () => {
                            console.log(`Video ${outputName} downloaded!`);
                            fs.unlinkSync(tempPath);
                            onDownload(videoPath);
                        })
                        .save(videoPath);
                })
                .pipe(fs.createWriteStream(tempPath));
        } else {
            onDownload(videoPath); 
        }
    }
}