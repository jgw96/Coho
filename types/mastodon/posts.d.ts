import { Account, Post, MediaAttachment } from './types';
export declare function whoBoostedAndFavorited(id: string): Promise<Account[]>;
export declare function editPost(id: string, newContent: string): Promise<Post>;
export declare function deletePost(id: string): Promise<Post>;
export declare function getPostDetail(id: string): Promise<Post>;
export declare function publishPost(post: string, ids?: Array<string>, sensitive?: boolean, spoilerText?: string, visibility?: string): Promise<Post>;
export declare function replyToPost(id: string, content: string): Promise<Post>;
export declare function uploadImageFromURL(url: string): Promise<MediaAttachment>;
export declare function uploadImageFromBlob(blob: Blob): Promise<MediaAttachment>;
export declare function pickMedia(): Promise<File[]>;
/**
 * Upload a media file to the Mastodon server
 * Note: This is the core API function. For local media caching,
 * use the wrapper function from services/posts.ts
 */
export declare function uploadMediaFileToServer(file: File): Promise<MediaAttachment>;
/**
 * Upload multiple media files to the server
 * Note: This is the core API function. For local media caching,
 * use the wrapper function from services/posts.ts
 */
export declare function uploadMultipleMediaFiles(files: File[]): Promise<MediaAttachment[]>;
export declare function updateMedia(id: string, description: string): Promise<MediaAttachment>;
