export interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'gifv' | 'unknown' | 'audio';
  url: string;
  preview_url: string;
  remote_url: string | null;
  text_url: string | null;
  meta: {
    small?: {
      width: number;
      height: number;
      size: string;
      aspect: number;
    };
    original?: {
      width: number;
      height: number;
      size: string;
      aspect: number;
    };
    focus?: {
      x: number;
      y: number;
    };
  };
  description: string | null;
  blurhash: string;
}
