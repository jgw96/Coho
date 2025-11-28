// Re-export everything from the mastodon library for backwards compatibility
export {
  requestMammothBot,
  summarize,
  translate,
  createAPost,
  createImage,
  isProofreaderAvailable,
  proofread,
} from '../mastodon';
