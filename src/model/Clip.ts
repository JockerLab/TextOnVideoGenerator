import { Color } from "../types";
import ffmpeg from 'fluent-ffmpeg';
import { OUTPUT_PATH } from "../constants";
import { IResolution } from "../interface/IResolution";

export class Clip {
    private outputName: string;
    private startTime: number;
    private duration: number;
    private textBackgroundColor: Color;
    private text: string;
    private lineLimit = 30;
    private border: number = 0;
    private fontSize: number = 0;
    private spaceBetween: number = 0;
    private topPadding: number = 0;

    constructor(
        outputName: string,
        startTime: number,
        duration: number,
        textBackgroundColor: Color,
        text: string
    ) {
        this.outputName = outputName;
        this.startTime = startTime;
        this.duration = duration;
        this.textBackgroundColor = textBackgroundColor;
        this.text = text;
    }

    private calcScale(width: number, height: number): number {
        if (width < height) {
            return width < 600 ? Math.ceil(600 / width) : 1;
        } else {
            return height < 600 ? Math.ceil(600 / height) : 1;
        }
    }

    private calcTextHeight(width: number, textLines: string[]): number {
        const usableWidth = Math.ceil(0.8 * width);
        this.fontSize = Math.ceil(usableWidth * 1.5 / this.lineLimit);
        this.border = Math.ceil(this.fontSize / 2);
        this.topPadding = this.fontSize + this.border * 2;
        this.spaceBetween = this.fontSize + this.border * 1.5;
        return textLines.length > 0
            ? this.topPadding * 2 + textLines.length * this.spaceBetween - this.fontSize
            : 0;
    }

    async createClip(videoPath: string, onCreate: (videoPath: string) => void): Promise<void> {    
        const textLines = this.getTextLines(this.text, this.lineLimit);

        let { width, height } = await this.getVideoResolution(videoPath);
        const scale = this.calcScale(width, height);
        const textHeight = this.calcTextHeight(width * scale, textLines);
        width = width * scale;
        height = height * scale + textHeight;

        ffmpeg(videoPath)
            .setStartTime(this.startTime)
            .setDuration(this.duration)
            .videoFilters([
                {
                    filter: 'scale',
                    options: {
                        w: width,
                        h: height,
                        force_original_aspect_ratio: 'disable'
                    }
                },
                {
                    filter: 'pad',
                    options: {
                        w: width,
                        h: height + textHeight,
                        x: 0,
                        y: textHeight,
                        color: 'black'
                    }
                },
                ...textLines.map((line, i) => 
                    this.getTextLineFilter(line, i)
                )
            ])
            .on('end', () => {
                onCreate(OUTPUT_PATH + this.outputName);
                console.log(`Video ${this.outputName} created!`);
            })
            .save(OUTPUT_PATH + this.outputName);
    }

    private escapeSymbols(line: string): string {
        return line.replace(/([;:])/g, '\\\\\\$1');
    }

    private getTextLineFilter(line: string, i: number): any {
        return {
            filter: 'drawtext',
            options: {
                fontfile:'open-sans.ttf',
                box: 1,
                boxborderw: this.border,
                boxcolor: this.textBackgroundColor,
                text: this.escapeSymbols(line),
                fontsize: this.fontSize,
                fontcolor: 'white',
                x: '(main_w/2-text_w/2)',
                y: this.topPadding + i * this.spaceBetween,
                shadowcolor: 'black'
            }
        }
    }

    private getTextLines(text: string, lineLimit: number) {
        if (!text.trim()) {
            return [];
        }
        const words = text.split(' ');
        let result: string[] = [];
        let line = '';

        for (const word of words) {
            if (line.length + word.length > lineLimit) {
                result.push(line);
                line = '';
            }
            line += word + ' ';
        }
        if (line) {
            result.push(line);
        }

        return result;
    }

    private getVideoResolution(videoPath: string): Promise<IResolution> {
        return new Promise((resolve, reject) => { 
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                resolve({
                    width: (metadata.streams[0].width ?? 0),
                    height: (metadata.streams[0].height ?? 0)
                });
            })
        });
    }
}