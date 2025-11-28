/**
 * Mastodon Library
 *
 * A library for interacting with the Mastodon API and Firebase Functions.
 * This can be used as a standalone library for other Mastodon clients.
 */

// Types
export * from './types';

// Config
export { FIREBASE_FUNCTIONS_BASE_URL, getFirebaseFunctionUrl } from './config/firebase';

// Account API
export {
  editAccount,
  getPeers,
  checkFollowing,
  getCurrentUser,
  unfollowUser,
  getAccount,
  getUsersPosts,
  getUsersFollowers,
  getFollowing,
  followUser,
  getInstanceInfo,
  initAuth,
  authToClient,
  registerAccount,
  getServers,
  isFollowingMe,
  muteUser,
  unmuteUser,
  blockUser,
  unblockUser,
  reportUser,
  type ReportOptions,
} from './account';

// AI API
export {
  requestMammothBot,
  summarize,
  translate,
  createAPost,
  createImage,
  isProofreaderAvailable,
  proofread,
} from './ai';

// Bookmarks API
export { getBookmarks, addBookmark } from './bookmarks';

// Favorites API
export { getFavorites } from './favorites';

// Messages API
export { getMessages } from './messages';

// Notifications API
export {
  getNotifications,
  clearNotifications,
  subToPush,
  modifyPush,
  unsubToPush,
} from './notifications';

// Posts API
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
  uploadMediaFileToServer,
  uploadMultipleMediaFiles,
  updateMedia,
} from './posts';

// Timeline API
export {
  enrichPostsWithReplyContext,
  savePlace,
  getHomeTimeline,
  mixTimeline,
  addSomeInterestFinds,
  getPreviewTimeline,
  getTrendingLinks,
  resetLastPageID,
  getLastPlaceTimeline,
  getPaginatedHomeTimeline,
  getPublicTimeline,
  boostPost,
  reblogPost,
  getReplies,
  reply,
  mediaTimeline,
  searchTimeline,
  getHashtagTimeline,
  getAStatus,
  getTrendingStatuses,
} from './timeline';
