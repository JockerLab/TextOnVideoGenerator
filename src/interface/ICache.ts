export interface ICache {
    put(fileName: string): void;
    has(fileName: string): boolean;
}