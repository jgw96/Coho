export { };

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

  // Chrome Proofreader API
  interface Proofreader {
    availability(options?: ProofreaderOptions): Promise<string>;
    create(options?: ProofreaderCreateOptions): Promise<ProofreaderSession>;
  }

  interface ProofreaderOptions {
    expectedInputLanguages?: string[];
  }

  interface ProofreaderCreateOptions {
    expectedInputLanguages?: string[];
    monitor?: (monitor: ProofreaderDownloadMonitor) => void;
  }

  interface ProofreaderDownloadMonitor {
    addEventListener(
      type: 'downloadprogress',
      listener: (event: { loaded: number }) => void
    ): void;
  }

  interface ProofreaderSession {
    proofread(text: string): Promise<ProofreadResult>;
    destroy(): void;
  }

  interface ProofreadResult {
    correctedInput: string;
    corrections: ProofreadCorrection[];
  }

  interface ProofreadCorrection {
    startIndex: number;
    endIndex: number;
    correction: string;
    correctionType?: string;
    explanation?: string;
  }

  const Proofreader: Proofreader;

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

  // Extended NotificationOptions for Service Workers
  interface ServiceWorkerNotificationOptions extends NotificationOptions {
    renotify?: boolean;
    actions?: NotificationAction[];
  }

  interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
  }

  // Extend ServiceWorkerRegistration.showNotification to accept extended options
  interface ServiceWorkerRegistration {
    showNotification(title: string, options?: ServiceWorkerNotificationOptions): Promise<void>;
  }
}

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_INSTANCES_SOCIAL_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
