type BlurhashCallback = (id: string, dataUrl: string) => void;
declare class BlurhashWorkerManager {
    private static instance;
    private worker;
    private callbacks;
    private constructor();
    static getInstance(): BlurhashWorkerManager;
    private initWorker;
    generateBlurhash(id: string, hash: string, width: number, height: number, callback: BlurhashCallback): void;
    terminate(): void;
}
export declare const getBlurhashWorker: () => BlurhashWorkerManager;
export {};
