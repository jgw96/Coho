import ImgWorker from '../utils/img-worker?worker';

type BlurhashCallback = (id: string, dataUrl: string) => void;

class BlurhashWorkerManager {
  private static instance: BlurhashWorkerManager;
  private worker: Worker | null = null;
  private callbacks: Map<string, BlurhashCallback> = new Map();

  private constructor() {
    this.initWorker();
  }

  static getInstance(): BlurhashWorkerManager {
    if (!BlurhashWorkerManager.instance) {
      BlurhashWorkerManager.instance = new BlurhashWorkerManager();
    }
    return BlurhashWorkerManager.instance;
  }

  private initWorker() {
    if (this.worker) return;

    this.worker = new ImgWorker();

    this.worker!.onmessage = (e) => {
      const receiveTime = Date.now();
      console.log('✓ Worker response received at', receiveTime, ':', e.data);
      const { id, bitmap } = e.data;

      if (!bitmap) {
        console.warn('⚠ No bitmap in response for id:', id);
        return;
      }

      const startConvert = Date.now();
      // Convert bitmap to data URL
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('❌ Could not get canvas context');
        return;
      }

      // Draw bitmap directly
      ctx.drawImage(bitmap, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      const endConvert = Date.now();

      console.log('✓ Canvas conversion took', endConvert - startConvert, 'ms');
      console.log('✓ Created data URL for', id);

      // Call the registered callback
      const callback = this.callbacks.get(id);
      if (callback) {
        callback(id, dataUrl);
        this.callbacks.delete(id);
      }
    };

    this.worker!.onerror = (error) => {
      console.error('❌ Worker error:', error);
    };

    console.log('✓ Singleton blurhash worker initialized');
  }

  generateBlurhash(
    id: string,
    hash: string,
    width: number,
    height: number,
    callback: BlurhashCallback
  ) {
    if (!this.worker) {
      console.error('❌ Worker not initialized');
      return;
    }

    // Store the callback
    this.callbacks.set(id, callback);

    const sendTime = Date.now();
    console.log('→ Sending to worker at', sendTime, 'for image', id);

    this.worker.postMessage({
      id,
      hash,
      width,
      height,
      sendTime,
    });
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.callbacks.clear();
      console.log('✓ Blurhash worker terminated');
    }
  }
}

// Export singleton instance getter
export const getBlurhashWorker = () => BlurhashWorkerManager.getInstance();
