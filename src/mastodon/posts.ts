import { fileOpen } from 'browser-fs-access';
import { Account, Post, MediaAttachment } from './types';

// Helper functions to always get fresh values from localStorage
const getServer = () => localStorage.getItem('server') || '';
const getAccessToken = () => localStorage.getItem('accessToken') || '';

export async function whoBoostedAndFavorited(id: string): Promise<Account[]> {
  const server = getServer();
  const accessToken = getAccessToken();
  const response = await fetch(
    `https://${server}/api/v1/statuses/${id}/reactions`,
    {
      method: 'GET',
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`,
      }),
    }
  );

  const data = await response.json();
  return data;
}

export async function editPost(id: string, newContent: string): Promise<Post> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.append('status', newContent);
  const response = await fetch(`https://${server}/api/v1/statuses/${id}`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function deletePost(id: string): Promise<Post> {
  const server = getServer();
  const accessToken = getAccessToken();
  const response = await fetch(`https://${server}/api/v1/statuses/${id}`, {
    method: 'DELETE',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  const data = await response.json();
  return data;
}

export async function getPostDetail(id: string): Promise<Post> {
  const server = getServer();
  const accessToken = getAccessToken();
  const response = await fetch(`https://${server}/api/v1/statuses/${id}`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
  });

  const data = await response.json();
  return data;
}

export async function publishPost(
  post: string,
  ids?: Array<string>,
  sensitive: boolean = false,
  spoilerText: string = '',
  visibility: string = 'public'
): Promise<Post> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();

  formData.append('status', post && post.length > 0 ? post : '');
  formData.append('visibility', visibility);

  if (ids && ids.length > 0) {
    for (const id of ids) {
      formData.append('media_ids[]', id);
    }
  }

  if (sensitive) {
    formData.append('sensitive', 'true');

    if (spoilerText && spoilerText.length > 0) {
      formData.append('spoiler_text', spoilerText);
    }
  }

  // make a fetch request to post a status using the mastodon api
  const response = await fetch(`https://${server}/api/v1/statuses`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function replyToPost(id: string, content: string): Promise<Post> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();

  formData.append('in_reply_to_id', id);

  formData.append('status', content && content.length > 0 ? content : '');

  // make a fetch request to post a status using the mastodon api
  const response = await fetch(`https://${server}/api/v1/statuses`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function uploadImageFromURL(
  url: string
): Promise<MediaAttachment> {
  const server = getServer();
  const accessToken = getAccessToken();
  const response = await fetch(`https://${server}/api/v2/media`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: JSON.stringify({
      url: url,
    }),
  });

  const data = await response.json();
  return data;
}

export async function uploadImageFromBlob(
  blob: Blob
): Promise<MediaAttachment> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.append('file', blob);

  const response = await fetch(`https://${server}/api/v2/media`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}

export async function pickMedia(): Promise<File[]> {
  try {
    const files = await fileOpen({
      mimeTypes: ['image/*', 'video/*'],
      multiple: true,
    });
    return Array.isArray(files) ? files : [files];
  } catch (err) {
    return [];
  }
}

/**
 * Upload a media file to the Mastodon server
 * Note: This is the core API function. For local media caching,
 * use the wrapper function from services/posts.ts
 */
export async function uploadMediaFileToServer(
  file: File
): Promise<MediaAttachment> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`https://${server}/api/v2/media`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}

/**
 * Upload multiple media files to the server
 * Note: This is the core API function. For local media caching,
 * use the wrapper function from services/posts.ts
 */
export async function uploadMultipleMediaFiles(
  files: File[]
): Promise<MediaAttachment[]> {
  const uploaded: MediaAttachment[] = [];

  for (const file of files) {
    const data = await uploadMediaFileToServer(file);
    uploaded.push(data);
  }

  return uploaded;
}

export async function updateMedia(
  id: string,
  description: string
): Promise<MediaAttachment> {
  const server = getServer();
  const accessToken = getAccessToken();
  const formData = new FormData();
  formData.append('description', description);

  const response = await fetch(`https://${server}/api/v1/media/${id}`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}
