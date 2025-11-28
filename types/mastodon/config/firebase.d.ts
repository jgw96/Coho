/**
 * Firebase Functions Configuration
 *
 * Switch between local emulator and production based on environment
 */
export declare const FIREBASE_FUNCTIONS_BASE_URL = "https://us-central1-coho-mastodon.cloudfunctions.net";
export declare function getFirebaseFunctionUrl(functionName: string): string;
