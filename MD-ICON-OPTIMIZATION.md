# MD-Icon Network Optimization Guide

## Problem
The `md-icon` component was loading SVG files over the network for every icon instance, causing:
- **Hundreds of network requests** on pages with many icons
- **Poor offline performance** when service worker cache is unavailable
- **Slow initial page loads** due to network waterfall
- **Wasted bandwidth** fetching the same SVG files repeatedly

## Solution
Enhanced `md-icon` with three-tier loading strategy:

### 1. **Named Icons (Recommended)** - Zero Network Requests
Built-in library of common icons bundled with the component:

```html
<!-- ✅ BEST: No network request, instant rendering -->
<md-icon name="home"></md-icon>
<md-icon name="search"></md-icon>
<md-icon name="heart"></md-icon>
```

**Available Named Icons:**
- `home` - Home outline
- `search` - Search/magnifying glass
- `heart` - Heart outline
- `bookmark` - Bookmark outline
- `notifications` - Notification bell
- `chatbox` - Chat bubble
- `add` - Plus/add icon
- `close` - X/close icon
- `settings` - Settings gear
- `eye` - Eye/visibility icon
- `trash` - Trash/delete icon
- `repeat` - Repeat/repost icon
- `share` - Share icon
- `ellipsis-vertical` - Three dots menu
- `copy` - Copy/duplicate icon
- `attach` - Attachment/paperclip
- `sparkles` - AI/sparkle icon
- `brush` - Paint brush
- `color-palette` - Color palette
- `planet` - Planet/globe (fediverse)
- `albums` - Media/albums
- `refresh` - Refresh/reload

### 2. **External SVGs with Caching** - One Request Per Unique Icon
External SVG files are cached in memory after first fetch:

```html
<!-- ⚠️ OK: First instance fetches, subsequent uses read from cache -->
<md-icon src="/assets/custom-icon.svg"></md-icon>
```

### 3. **Inline SVG** - No Network, Custom Content
Direct SVG content via slot:

```html
<!-- ℹ️ OK: For dynamic or one-off SVGs -->
<md-icon>
  <svg viewBox="0 0 24 24">
    <path d="..."/>
  </svg>
</md-icon>
```

## Migration Guide

### Quick Wins - Replace Common Paths
Update these frequently-used icons to named versions:

| Old `src` Attribute | New `name` Attribute | Instances Saved |
|---------------------|----------------------|-----------------|
| `src="/assets/home-outline.svg"` | `name="home"` | ~10-20 per page |
| `src="/assets/search-outline.svg"` | `name="search"` | ~5-10 per page |
| `src="/assets/heart-outline.svg"` | `name="heart"` | ~50+ (timeline) |
| `src="/assets/bookmark-outline.svg"` | `name="bookmark"` | ~50+ (timeline) |
| `src="/assets/notifications-outline.svg"` | `name="notifications"` | ~5-10 per page |
| `src="/assets/add-outline.svg"` | `name="add"` | ~10-15 per page |
| `src="/assets/close-outline.svg"` | `name="close"` | ~5-10 per page |
| `src="/assets/settings-outline.svg"` | `name="settings"` | ~5 per page |
| `src="/assets/eye-outline.svg"` | `name="eye"` | ~5 per page |
| `src="/assets/repeat-outline.svg"` | `name="repeat"` | ~50+ (timeline) |
| `src="/assets/share-social-outline.svg"` | `name="share"` | ~50+ (timeline) |
| `src="/assets/ellipsis-vertical-outline.svg"` | `name="ellipsis-vertical"` | ~50+ (timeline) |
| `src="/assets/trash-outline.svg"` | `name="trash"` | ~10 per page |
| `src="/assets/chatbox-outline.svg"` | `name="chatbox"` | ~5 per page |
| `src="/assets/copy-outline.svg"` | `name="copy"` | ~5 per page |
| `src="/assets/attach-outline.svg"` | `name="attach"` | ~5 per page |
| `src="/assets/sparkles-outline.svg"` | `name="sparkles"` | ~10 (AI features) |
| `src="/assets/brush-outline.svg"` | `name="brush"` | ~5 per page |
| `src="/assets/color-palette-outline.svg"` | `name="color-palette"` | ~5 per page |
| `src="/assets/planet-outline.svg"` | `name="planet"` | ~5 per page |
| `src="/assets/albums-outline.svg"` | `name="albums"` | ~5 per page |
| `src="/assets/refresh-circle-outline.svg"` | `name="refresh"` | ~5 per page |

### Migration Example
**Before (Network Request Every Time):**
```typescript
html`
  <md-tab slot="nav" panel="general">
    <md-icon slot="icon" src="/assets/home-outline.svg"></md-icon>
    <span class="tab-label">Home</span>
  </md-tab>
`
```

**After (Instant, No Network):**
```typescript
html`
  <md-tab slot="nav" panel="general">
    <md-icon slot="icon" name="home"></md-icon>
    <span class="tab-label">Home</span>
  </md-tab>
`
```

### Batch Migration Commands

Search and replace in your editor:

```bash
# Find all md-icon src usages
grep -r 'md-icon.*src="/assets/' src/

# Example replacements (use your editor's find/replace):
src="/assets/home-outline.svg"          → name="home"
src="/assets/search-outline.svg"        → name="search"
src="/assets/heart-outline.svg"         → name="heart"
src="/assets/bookmark-outline.svg"      → name="bookmark"
src="/assets/notifications-outline.svg" → name="notifications"
```

## Performance Impact

### Before Optimization
- **Timeline with 50 posts**: ~250 network requests (5 icons per post)
- **Home page load**: ~30 network requests for icons
- **Offline mode**: Slow icon loading waiting for service worker

### After Optimization (Named Icons)
- **Timeline with 50 posts**: 0 network requests for icons ✅
- **Home page load**: 0 network requests for icons ✅
- **Offline mode**: Instant icon rendering ✅

### Caching Benefits
For icons still using `src`:
- **First load**: 1 network request per unique SVG
- **Subsequent loads**: 0 requests (read from memory)
- **Memory overhead**: ~1-5 KB per unique icon (negligible)

## Adding New Named Icons

To add more icons to the built-in library:

1. **Get SVG content**:
   ```bash
   cat public/assets/your-icon.svg
   ```

2. **Add to ICON_LIBRARY** in `src/components/md-icon.ts`:
   ```typescript
   const ICON_LIBRARY: Record<string, string> = {
     // ... existing icons
     'your-icon': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">...</svg>',
   };
   ```

3. **Update this document** with the new icon name

4. **Migrate usages**:
   ```html
   <!-- Before -->
   <md-icon src="/assets/your-icon.svg"></md-icon>

   <!-- After -->
   <md-icon name="your-icon"></md-icon>
   ```

## Backward Compatibility

✅ **Fully backward compatible** - existing `src` usages continue to work with in-memory caching.

The component prioritizes sources in this order:
1. `name` attribute (named icons)
2. `src` attribute (external SVGs with cache)
3. Default slot (inline SVG)

## Best Practices

1. **Prefer named icons** for all icons in the built-in library
2. **Use `src` sparingly** for custom/unique icons not in the library
3. **Add frequently-used custom icons** to the library instead of using `src`
4. **Use inline SVG** only for dynamic content (e.g., generated SVGs)

## Cache Clearing

The in-memory SVG cache persists for the lifetime of the page/app session. It automatically clears on:
- Page reload/refresh
- App restart
- Service worker update (new deployment)

No manual cache clearing is needed - the cache is purely an in-memory optimization.

## TypeScript Support

The component exports proper types:

```typescript
interface MdIcon extends LitElement {
  name?: string;  // Named icon from library
  src?: string;   // External SVG path (cached)
  label?: string; // Accessibility label
  size?: string;  // CSS size value (default: 24px)
}

// Events
'md-icon-load'  // detail: { name/src, cached? }
'md-icon-error' // detail: { name/src, error }
```

## Next Steps

1. **Migrate high-traffic pages first**: `app-home.ts`, `timeline.ts`, `timeline-item.ts`
2. **Monitor network tab**: Verify reduced icon requests
3. **Add more named icons**: Add frequently-used custom icons to library
4. **Update copilot instructions**: Document named icon preference for future development
