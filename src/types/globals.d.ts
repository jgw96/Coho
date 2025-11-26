export {};

declare global {
  interface Window {
    summarizer: {
      capabilities(): Promise<{ available: string }>;
      create(options: any): Promise<SummarizerSession>;
    };
    LanguageDetector: {
      create(): Promise<LanguageDetectorSession>;
    };
    Translator: {
      availability(options: {
        sourceLanguage: string;
        targetLanguage: string;
      }): Promise<string>;
      create(options: {
        sourceLanguage: string;
        targetLanguage: string;
      }): Promise<TranslatorSession>;
    };
  }

  interface SummarizerSession {
    summarize(text: string): Promise<string>;
    destroy(): void;
  }

  interface LanguageDetectorSession {
    detect(
      text: string
    ): Promise<{ detectedLanguage: string; confidence: number }[]>;
    destroy(): void;
  }

  interface TranslatorSession {
    translate(text: string): Promise<string>;
    destroy(): void;
  }

  interface PeriodicSyncManager {
    register(tag: string, options?: { minInterval: number }): Promise<void>;
    getTags(): Promise<string[]>;
    unregister(tag: string): Promise<void>;
  }

  interface ServiceWorkerRegistration {
    periodicSync: PeriodicSyncManager;
  }
}
