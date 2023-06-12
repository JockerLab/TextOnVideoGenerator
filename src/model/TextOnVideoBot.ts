import { catchErrors, getHash } from '../utils';
import * as fs from 'fs';
import { SUFFIX_NAME } from '../constants';
import { Clip } from '../model/Clip';
import { VideoDownloader } from '../model/VideoDownloader';
import TelegramBot from 'node-telegram-bot-api';
import FormData from 'form-data';
import axios from 'axios';
import { IConfigService } from '../interface/IConfigService';
import { VideoParams } from './VideoParams';
import { ICache } from '../interface/ICache';


export class TextOnVideoBot extends TelegramBot {
    constructor(private config: IConfigService, private cache: ICache) {
        super(config.get('BOT_TOKEN') ?? '', {
            polling: true
        });

        this.onText(/^\/create_video --help$/, this.usage.bind(this));

        this.onText(
            /^\/create_video (?!--help).*$/,
            this.createVideoCommand.bind(this)
        );
    }

    @catchErrors
    private async createVideoCommand(msg: TelegramBot.Message, match: RegExpExecArray | null) {
        if (!match || !match.every((match) => match)) {
            this.usage(msg);
            return;
        }
        const options = match[0].split('--').slice(1).map((option) => option.trim());
        const params: Record<string, string> = {};
        for (const option of options) {
            let [ key, value ] = option.split(/=(.*)/s);
            if (key === 'text') {
                value = value.slice(1, -1);
            }
            params[key] = value;
        }
        const videoParams = new VideoParams(params);
        console.log(videoParams);
        const outputName = getHash(
                videoParams.link + videoParams.extension
            ) 
            + '_' 
            + SUFFIX_NAME 
            + videoParams.extension;
        
        const clip = new Clip(
            outputName,
            videoParams
        );

        await VideoDownloader.download(
            this.cache,
            outputName,
            videoParams.link,
            videoParams.quality,
            (videoPath) =>
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
            `https://api.telegram.org/bot${this.config.get('BOT_TOKEN')}/sendVideo`, 
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
            `Use /create_video [--link=<link>] [--start_time=<start_time>] [--duration=<duration>] [--quality=<quality>] [--extension=<extension>] [--color=<color>] [--text="<text>"].\n
<link> — correct video link on youtube;\n
<start_time> — time from beginning of video in seconds;\n
<duration> — duration of output video in seconds;\n
<quality> — low or high;\n
<extension> — mp4, wav or webm;\n
<color> — green, orange or white;\n
<text> — text to display. Note, <text> should be quoted.`
        );
    }
}