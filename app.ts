import * as fs from 'fs';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { Md5 } from 'ts-md5'

// todo: вынести переменные
// todo: добавить автоматическое создание папок (/downloaded, /videos)
// todo: вынести отступ у текста сверху
// todo: escape symbols with \\\\\\

const SUFFIX_NAME = 'video.mp4';

const link = 'https://www.youtube.com/watch?v=3rOXX9-28vc';
const outputName = hash(link) + '_' + SUFFIX_NAME;
const startTime = 4; // seconds
const duration = 7; // seconds
const textColor = 'green';
const lineLimit = 30;
const text = "Сева кидает мем             Данил\\\\\\: ";
const width = 640;
const height = 960;
const aspect = 1;
const textLines = getTextLines(text, lineLimit);
const outputPath = './videos/';
const downloadedPath = './downloaded/';

function hash(value: string) {
    return Md5.hashStr(value);
}

function getTextLines(text: string, lineLimit: number) {
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

function showTextLine(line: string, i: number): any {
    return {
        filter: 'drawtext',
        options: {
            fontfile:'font.ttf',
            box: 1,
            boxborderw: 15,
            boxcolor: textColor,
            text: line,
            fontsize: 28,
            fontcolor: 'white',
            x: '(main_w/2-text_w/2)',
            y: 30 + i * 60,
            shadowcolor: 'black'
        }
    }
}

function downloadHandler() {
    console.log('Video downloaded!');
    
    ffmpeg(downloadedPath + outputName)
        .setStartTime(startTime)
        .setDuration(duration)
        .videoFilters([
            {
                filter: 'scale',
                options: {
                    w: 'if(gt(a,' + aspect + '),' + width + ',trunc(' + height + '*a/2)*2)',
                    h: 'if(lt(a,' + aspect + '),' + height + ',trunc(' + width + '/a/2)*2)'
                }
            },
            {
                filter: 'pad',
                options: {
                    w: width,
                    h: height,
                    x: 'if(gt(a,' + aspect + '),0,(' + width + '-iw)/2)',
                    y: 'if(lt(a,' + aspect + '),0,(' + height + '-ih)/2)',
                    color: 'black'
                }
            }
        ])
        .videoFilters([
            ...textLines.map((line, i) => 
                showTextLine(line, i)
            )
        ])
        .save(outputPath + outputName);

    console.log('Video trimmed!');
    console.log(`Video ${outputName} created!`);
}

if (!fs.existsSync(downloadedPath + outputName)) {
    ytdl(link, {
        quality: 'lowest'
    })
        .on('end', downloadHandler)
        .pipe(fs.createWriteStream(downloadedPath + outputName));
} else {
    downloadHandler();   
}