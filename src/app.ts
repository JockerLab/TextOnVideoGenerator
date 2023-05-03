import { SUFFIX_NAME, getHash } from './utils';
import { Clip } from './Clip';
import { VideoDownloader } from './VideoDownloader';


// Ticket 3. todo: вынести отступ у текста сверху
// Ticket 3. todo: сделать автоматическое определение паддинга, шрифта и т.п.
// Ticket 4. todo: деплой
// todo: разнести все по разным файлам


// Download video and create clip
const link = 'https://www.youtube.com/watch?v=iE9OaOFgj0k';
const videoExtension = 'mp4';
const startTime = 405;
const duration = 5;
const textBackgroundColor = 'green';
const text = 'Данил после стажки на плюсах в Я.Браузере';
const outputName = getHash(link + videoExtension) + '_' + SUFFIX_NAME + videoExtension;

const clip = new Clip(
    outputName,
    startTime,
    duration,
    textBackgroundColor,
    text
);
VideoDownloader.download(outputName, link, (videoPath) => clip.createClip(videoPath));