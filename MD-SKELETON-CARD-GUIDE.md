# MD Skeleton Card Component Guide

## Overview
`md-skeleton-card` is a Material Design 3 skeleton screen component used to show loading placeholders while content is being fetched. It provides an animated shimmer effect that matches the structure of timeline items.

## Component

### Tag Name
`<md-skeleton-card>`

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `1` | Number of skeleton cards to render |

## Usage Examples

### Timeline Loading State
```typescript
import './md-skeleton-card';

// In your component
@state() loadingData: boolean = false;
@state() timeline: Post[] = [];

render() {
  return html`
    <ul>
      ${this.loadingData && this.timeline.length === 0
        ? html`<md-skeleton-card count="5"></md-skeleton-card>`
        : this.timeline.map(item => html`<timeline-item .tweet=${item}></timeline-item>`)}
    </ul>
  `;
}
```

### Bookmarks/Favorites Loading State
```typescript
import './md-skeleton-card';

// In your component
@state() isLoading = true;
@state() bookmarks = [];

render() {
  return html`
    <ul>
      ${this.isLoading
        ? html`<md-skeleton-card count="5"></md-skeleton-card>`
        : this.bookmarks.map(item => html`<timeline-item .tweet=${item}></timeline-item>`)}
    </ul>
  `;
}
```

### Standalone Usage
```html
<!-- Show 3 skeleton cards -->
<md-skeleton-card count="3"></md-skeleton-card>

<!-- Show single skeleton card -->
<md-skeleton-card></md-skeleton-card>
```

## Structure

Each skeleton card includes:
- **Avatar**: Circular placeholder for user avatar
- **User Info**: Two lines (username and handle)
- **Content**: Three lines of text placeholder
- **Media**: Rectangle placeholder for images/videos
- **Actions**: Four circular button placeholders

## Design Tokens Used

### Light Mode
- `--md-sys-color-surface-container`: Card background
- `--md-sys-color-surface-variant`: Skeleton element base color (#e0e0e0)
- `--md-sys-color-surface-container-highest`: Shimmer highlight (#f0f0f0)
- `--md-sys-color-outline-variant`: Card border

### Dark Mode
- Automatically switches to dark colors via `@media(prefers-color-scheme: dark)`
- Uses `#2b2b2b` and `#3a3a3a` for shimmer effect

## Animation

The component uses a CSS shimmer animation:
- **Duration**: 2 seconds
- **Easing**: Linear
- **Loop**: Infinite
- **Effect**: Horizontal shimmer sweep from left to right

## Responsive Behavior

### Mobile (`max-width: 820px`)
- Reduced padding: `12px` instead of `16px`
- Smaller border radius: `8px` instead of `12px`
- Shorter media height: `180px` instead of `200px`

## Implementation Details

### File Location
- Component: `src/components/md-skeleton-card.ts`
- Types: `types/components/md-skeleton-card.d.ts`

### Dependencies
- Lit 3.x (`LitElement`, `html`, `css`)
- No external component dependencies

### Styling Approach
- Material Design 3 tokens with Shoelace fallbacks
- Self-contained styles (no shared-styles import)
- Dark mode via media query (not JavaScript)

## Best Practices

### When to Use
✅ Initial page load while fetching data
✅ Infinite scroll loading states
✅ Refreshing timeline/bookmarks/favorites
✅ Any async data fetch that matches timeline-item structure

### When NOT to Use
❌ Button loading states (use disabled state + spinner)
❌ Non-list layouts (create specific skeleton for that layout)
❌ After data is already loaded (use actual components)

### Performance Tips
1. **Limit count**: Don't render 100+ skeleton cards, 5-10 is typically enough
2. **Conditional rendering**: Only show when `isLoading && items.length === 0`
3. **Remove when done**: Switch to real content as soon as data arrives

## Accessibility

The skeleton cards are purely visual placeholders with no interactive elements:
- No ARIA roles needed (decorative)
- Animation respects `prefers-reduced-motion` (future enhancement)
- Screen readers will announce real content when loaded

## Future Enhancements
- [ ] Respect `prefers-reduced-motion` to disable shimmer
- [ ] Variant prop for compact/expanded layouts
- [ ] Optional media skeleton (some posts don't have images)
- [ ] Integration with `content-visibility: auto` for better performance
