# Mastodon Library

A TypeScript library for interacting with the Mastodon API and Firebase Functions backend.

## Overview

This library provides a clean API for:
- Mastodon REST API interactions
- Firebase Functions backend for certain operations
- Type definitions for Mastodon data structures

## Usage

### In this repository (Coho app)

Import directly from the mastodon library:

```typescript
import { 
  getCurrentUser, 
  publishPost, 
  getHomeTimeline,
  type Post,
  type Account 
} from '../mastodon';
```

Or for backwards compatibility, imports from the `services` directory still work:

```typescript
import { getCurrentUser } from '../services/account';
import { publishPost } from '../services/posts';
```

### As a standalone library

The library can potentially be extracted and published as an npm package for use in other Mastodon clients.

## API Modules

### Account (`account.ts`)
- `getCurrentUser()` - Get current authenticated user
- `editAccount()` - Update account profile
- `followUser(id)` - Follow a user
- `unfollowUser(id)` - Unfollow a user
- `blockUser(id)` / `unblockUser(id)` - Block/unblock users
- `muteUser(id)` / `unmuteUser(id)` - Mute/unmute users
- `getAccount(id)` - Get account details
- `getFollowing(id)` / `getUsersFollowers(id)` - Get follow relationships
- `initAuth(server)` / `authToClient(code, state)` - OAuth flow
- And more...

### Timeline (`timeline.ts`)
- `getHomeTimeline()` - Get home timeline
- `getPaginatedHomeTimeline(type)` - Paginated timeline
- `getPublicTimeline()` - Public timeline
- `getTrendingStatuses()` - Trending posts
- `getHashtagTimeline(hashtag)` - Hashtag timeline
- `getReplies(id)` - Get post replies
- `searchTimeline(query)` - Search posts
- And more...

### Posts (`posts.ts`)
- `publishPost(content, mediaIds, sensitive, spoilerText, visibility)` - Create post
- `editPost(id, content)` - Edit post
- `deletePost(id)` - Delete post
- `replyToPost(id, content)` - Reply to post
- `uploadMediaFileToServer(file)` - Upload media
- `updateMedia(id, description)` - Update media alt text
- And more...

### Notifications (`notifications.ts`)
- `getNotifications()` - Get notifications
- `clearNotifications()` - Clear all notifications
- `subToPush()` - Subscribe to push notifications
- `modifyPush(flags)` - Modify push preferences
- `unsubToPush()` - Unsubscribe from push

### AI Features (`ai.ts`)
- `createAPost(prompt)` - AI-generated post content
- `createImage(prompt)` - AI-generated images
- `translate(text, language)` - Translation
- `summarize(text)` - Text summarization
- `proofread(text)` - Grammar/spelling check

### Bookmarks & Favorites
- `getBookmarks()` / `addBookmark(id)` - Bookmark management
- `getFavorites()` - Get favorited posts

### Messages (`messages.ts`)
- `getMessages()` - Get direct messages

## Types

The library exports TypeScript interfaces for Mastodon data structures:

- `Post` - Status/post structure
- `Account` - User account structure
- `MediaAttachment` - Media attachment structure
- `Emoji` - Custom emoji structure
- `Field` - Profile field structure

## Authentication

The library expects authentication tokens to be stored in localStorage:
- `accessToken` - OAuth access token
- `server` - Mastodon server URL (e.g., "mastodon.social")

For service workers, tokens are also stored in IndexedDB via `idb-keyval`.

## Configuration

Firebase Functions URL is configured in `config/firebase.ts`. The library automatically switches between production and local emulator based on the current hostname.
