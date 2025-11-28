import type { MediaAttachment } from '../mastodon';
export { whoBoostedAndFavorited, editPost, deletePost, getPostDetail, publishPost, replyToPost, uploadImageFromURL, uploadImageFromBlob, pickMedia, updateMedia, } from '../mastodon';
/**
 * Upload a media file and save it to local media storage
 * This wraps the mastodon library function to add local caching
 */
export declare function uploadMediaFile(file: File): Promise<MediaAttachment>;
/**
 * Upload multiple media files using file picker dialog and save to local storage
 * This wraps the mastodon library function to add local caching
 */
export declare function uploadImageAsFormData(): Promise<MediaAttachment[]>;
