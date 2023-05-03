import { Color } from "./types";
import ffmpeg from 'fluent-ffmpeg';
import { OUTPUT_PATH } from "./utils";

export class Clip {
    private outputName: string;
    private startTime: number;
    private duration: number;
    private textBackgroundColor: Color;
    private text: string;

    // todo: убрать
    private lineLimit = 30;
    private width = 606;
    private height = 1080;
    private aspect = 1;

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

    private getTextLines(text: string, lineLimit: number) {
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

    private escapeSymbols(line: string): string {
        return line.replace(/([;:])/g, '\\\\\\$1');
    }

    private getTextLineFilter(line: string, i: number): any {
        return {
            filter: 'drawtext',
            options: {
                fontfile:'font.ttf',
                box: 1,
                boxborderw: 15, // todo: autocalc
                boxcolor: this.textBackgroundColor,
                text: this.escapeSymbols(line),
                fontsize: 28, // todo: autocalc
                fontcolor: 'white',
                x: '(main_w/2-text_w/2)',
                y: 30 + i * 60, // todo: autocalc
                shadowcolor: 'black'
            }
        }
    }

    createClip(videoPath: string): void {    
        const textLines = this.getTextLines(this.text, this.lineLimit);

        ffmpeg(videoPath)
            .setStartTime(this.startTime)
            .setDuration(this.duration)
            .videoFilters([
                {
                    filter: 'scale',
                    options: {
                        // todo: вынести в отдельный метод 
                        w: 'if(gt(a,' + this.aspect + '),' + this.width + ',trunc(' + this.height + '*a/2)*2)',
                        h: 'if(lt(a,' + this.aspect + '),' + this.height + ',trunc(' + this.width + '/a/2)*2)'
                    }
                },
                {
                    filter: 'pad',
                    options: {
                        // todo: сделать автоподбор
                        w: this.width,
                        h: this.height,
                        // todo: вынести в отдельный метод 
                        x: 'if(gt(a,' + this.aspect + '),0,(' + this.width + '-iw)/2)',
                        y: 'if(lt(a,' + this.aspect + '),0,(' + this.height + '-ih)/2)',
                        color: 'black'
                    }
                }
            ])
            .videoFilters([
                ...textLines.map((line, i) => 
                    this.getTextLineFilter(line, i)
                )
            ])
            .on('end', () => {
                console.log(`Video ${this.outputName} created!`);
            })
            .save(OUTPUT_PATH + this.outputName);
    }
}