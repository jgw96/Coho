export declare const requestMammothBot: (prompt: string, previousMessages: {
    role: string;
    content: string;
}[]) => Promise<any>;
export declare const summarize: (prompt: string) => Promise<any>;
export declare const translate: (prompt: string, language?: string) => Promise<any>;
export declare const createAPost: (prompt: string) => Promise<any>;
export declare const createImage: (prompt: string) => Promise<any>;
