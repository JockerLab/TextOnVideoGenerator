import TelegramBot from 'node-telegram-bot-api';
import { Md5 } from 'ts-md5';
import { BotError } from './error/BotError';

export function getHash(value: string) {
    return Md5.hashStr(value);
}

export function catchErrors(
    target: any,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(
        msg: TelegramBot.Message, 
        match: RegExpExecArray | null
    ) => any>
) {
    const method = descriptor.value!;

    descriptor.value = async function(
        msg: TelegramBot.Message, 
        match: RegExpExecArray | null
    ) {
        try {
            return await method.call(this, msg, match);
        }
        catch (error) {
            if (error instanceof BotError) {
                console.log(error.message);
                // @ts-ignore
                await this.sendMessage(msg.chat.id, error.message);
            } else {
                // ignore
            }
        }
    };
}
