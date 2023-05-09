import { getHash } from '../utils';
import * as fs from 'fs';
import { SUFFIX_NAME } from '../constants';
import { Clip } from '../model/Clip';
import { VideoDownloader } from '../model/VideoDownloader';
import { DotenvParseOutput } from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import FormData from 'form-data';
import axios from 'axios';


export class TextOnVideoBot extends TelegramBot {
    constructor(private config: DotenvParseOutput) {
        super(config['BOT_TOKEN'], { polling: true });

        this.onText(
            /\/create_video (\S+) (\d+) (\d+) (".+")/,
            this.createVideoCommand.bind(this)
        );

        this.onText(/\/create_video(?!\s*\S+ \d+ \d+ ".+")/, this.usage.bind(this));
    }

    private createVideoCommand(msg: TelegramBot.Message, match: RegExpExecArray | null) {
        if (!match || !match.every((match) => match)) {
            this.usage(msg);
            return;
        }
        const link = match[1];
        const startTime = +match[2];
        const duration = +match[3];
        const text = match[4].slice(1, -1);
        const videoExtension = 'mp4'; // todo: вынести
        const textBackgroundColor = 'green'; // todo: вынести
        const outputName = getHash(link + videoExtension) + '_' + SUFFIX_NAME + videoExtension;
        
        const clip = new Clip(
            outputName,
            startTime,
            duration,
            textBackgroundColor,
            text
        );

        VideoDownloader.download(outputName, link, (videoPath) => 
            this.onDownload(videoPath, msg.chat.id, clip)
        );
    }

    private async onCreate(videoPath: string, chatId: number, messageId: number) {
        this.editMessageText('Video created!', {
            chat_id: chatId,
            message_id: messageId
        });

        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('video', fs.createReadStream(videoPath));
        
        await axios.post(
            `https://api.telegram.org/bot${this.config['BOT_TOKEN']}/sendVideo`, 
            form, 
            { headers: form.getHeaders() }
        );

        this.deleteMessage(chatId, messageId);
    };

    private async onDownload(videoPath: string, chatId: number, clip: Clip) {
        const message = await this.sendMessage(chatId, 'Video downloaded!');
        clip.createClip(videoPath, (videoPath) => this.onCreate(
            videoPath,
            chatId,
            message.message_id
        ));
    }

    private usage(msg: TelegramBot.Message) {
        this.sendMessage(
            msg.chat.id,
            `Use /create_video <link> <start_time> <duration> "<text>".\n
<link> — correct video link on youtube;\n
<start_time> — time from beginning of video in seconds;\n
<duration> — duration of output video in seconds;\n
<text> — text to display. Note, <text> should be quoted.`
        );
    }
}