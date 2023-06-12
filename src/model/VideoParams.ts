import { Color, Quality, VideoExtension } from "../types";

export class VideoParams {
    link: string = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
    start_time: number = 0;
    duration: number = 3 * 60 * 60;
    quality: Quality = 'low';
    text: string = '';
    extension: VideoExtension = 'mp4';
    color: Color = 'green';
    
    constructor(params: any) {
        params.start_time = params.start_time ? +params.start_time : params.start_time;
        params.duration = params.duration ? +params.duration : params.duration;
        Object.assign(this, params);
    }
}