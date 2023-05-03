import { Md5 } from 'ts-md5';

export const SUFFIX_NAME = 'video.';
export const OUTPUT_PATH = './videos/';
export const DOWNLOADED_PATH = './downloaded/';

export function getHash(value: string) {
    return Md5.hashStr(value);
}