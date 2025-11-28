import { fileOpen } from 'browser-fs-access';
import { addMedia } from './media';

import type { MediaAttachment } from '../mastodon';
import {
  uploadMediaFileToServer,
} from '../mastodon';

// Re-export everything from the mastodon library for backwards compatibility
export {
  whoBoostedAndFavorited,
  editPost,
  deletePost,
  getPostDetail,
  publishPost,
  replyToPost,
  uploadImageFromURL,
  uploadImageFromBlob,
  pickMedia,
  updateMedia,
} from '../mastodon';

/**
 * Upload a media file and save it to local media storage
 * This wraps the mastodon library function to add local caching
 */
export async function uploadMediaFile(file: File): Promise<MediaAttachment> {
  const data = await uploadMediaFileToServer(file);
  await addMedia(file);
  return data;
}

/**
 * Upload multiple media files using file picker dialog and save to local storage
 * This wraps the mastodon library function to add local caching
 */
export async function uploadImageAsFormData(): Promise<MediaAttachment[]> {
  const files = await fileOpen({
    mimeTypes: ['image/*', 'video/*'],
    multiple: true,
  });

  const uploaded: MediaAttachment[] = [];

  for (const file of files) {
    const data = await uploadMediaFileToServer(file);
    uploaded.push(data);
    await addMedia(file);
    console.log('uploaded', uploaded);
  }

  return uploaded;
}
