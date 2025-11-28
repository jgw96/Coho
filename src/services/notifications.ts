// Re-export everything from the mastodon library for backwards compatibility
export {
  getNotifications,
  clearNotifications,
  subToPush,
  modifyPush,
  unsubToPush,
} from '../mastodon';
