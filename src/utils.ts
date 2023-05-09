import { Md5 } from 'ts-md5';

export function getHash(value: string) {
    return Md5.hashStr(value);
}