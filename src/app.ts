import { SUFFIX_NAME, getHash } from './utils';
import { Clip } from './Clip';
import { VideoDownloader } from './VideoDownloader';


// Ticket 4. todo: деплой
// todo: сделать обработку ошибок
// todo: раскидать файлы нормально
// todo: telegram bot


// Download video and create clip
const link = 'https://www.youtube.com/watch?v=eGICF39SmgE';
const videoExtension = 'mp4';
const startTime = 47;
const duration = 3;
const textBackgroundColor = 'green';
const text = 'Чипс крутится. Чипс крутится. Чипс крутится.';
const outputName = getHash(link + videoExtension) + '_' + SUFFIX_NAME + videoExtension;

const clip = new Clip(
    outputName,
    startTime,
    duration,
    textBackgroundColor,
    text
);
VideoDownloader.download(outputName, link, (videoPath) => clip.createClip(videoPath));
