import { Color, Quality, VideoExtension } from "../types";
import { VideoParamsSchema } from "../schema";
import { BotError } from "../error/BotError";

export class VideoParams {
    link: string = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
    start: number = 0;
    duration: number = 3 * 60 * 60;
    quality: Quality = 'low';
    text: string = '';
    extension: VideoExtension = 'mp4';
    color: Color = 'green';
    
    constructor(params: any) {
        const { error } = VideoParamsSchema.validate(params);
        if (error) {
            throw new BotError(error?.message ?? '');
        }
        if (params.hasOwnProperty('start')) {
            params.start = +params.start;
        }
        if (params.hasOwnProperty('duration')) {
            params.duration = +params.duration;
        }
        Object.assign(this, params);
    }

    static getUsage() {
        return `Use /create_video [--link=<link>] [--start=<start>] [--duration=<duration>] [--quality=<quality>] [--extension=<extension>] [--color=<color>] [--text="<text>"].\n
<link> — correct video link on youtube;\n
<start> — time from beginning of video in seconds. 0 by default;\n
<duration> — duration of output video in seconds. Max duration by default;\n
<quality> — low or high. Low by default;\n
<extension> — mp4, wav or webm. MP4 by default;\n
<color> — green, orange or blue. Green by default;\n
<text> — text to display. Note, <text> should be quoted.`
    }
}
