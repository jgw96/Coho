# Coho: A Mastodon App

**Not familiar with Mastodon? [Learn More](https://joinmastodon.org/)**

## Status: Currently In Public Alpha

<div>
  <img height="400px" src="/public/assets/screenshots/new-screens/desktop-one.png" />
  <img height="400px" src="/public/assets/screenshots/new-screens/mobile-one.png" />
</div>

<div>
  <img height="400px" src="/public/assets/screenshots/new-screens/desktop-three.png" />
  <img height="400px" src="/public/assets/screenshots/new-screens/mobile-two.png" />
</div>

## Features

### Customizeable

- Dark and light mode support
- Themeable
- Wellness mode: Hides likes and boosts
- Focus mode
- Data Saver mode

### User Friendly

- Cross Platform
- Fast

## Get the app

- [PWA](https://wonderful-glacier-07b022d1e.2.azurestaticapps.net/home)

## Development

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (includes automatic image optimization)
npm run build
```

### Image Optimization

All images are automatically optimized during the build process using our custom optimization script. This reduces bundle size by ~70% on average.

```bash
# Manually optimize images
npm run optimize-images

# Preview optimizations (dry-run)
npm run optimize-images:check

# Verbose output showing each file
npm run optimize-images:verbose
```

See [scripts/README.md](scripts/README.md) for more details on the build tools.
