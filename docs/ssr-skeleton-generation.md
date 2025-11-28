# SSR Skeleton Generation

Coho uses build-time Server-Side Rendering (SSR) to generate a pre-rendered HTML skeleton of the login page. This skeleton is injected into `index.html` during the build process, providing users with an instant visual while JavaScript loads.

## Overview

Instead of showing a blank white screen while the app's JavaScript bundle downloads and executes, users immediately see a fully-styled login page. Once the JavaScript loads, the real `app-index` component takes over and replaces the skeleton.

```
Build Time                              Runtime
┌─────────────────┐                    ┌─────────────────┐
│ Generate HTML   │                    │ User visits /   │
│ skeleton using  │──inject into──────▶│ Sees skeleton   │
│ Lit SSR         │   index.html       │ immediately     │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │ JS loads, real  │
                                       │ app takes over  │
                                       └─────────────────┘
```

## How It Works

### 1. Browser Global Mocking

Lit components often reference browser APIs that don't exist in Node.js. The script mocks these before importing any components:

```typescript
const mockLocation = { pathname: '/', search: '', hash: '', href: 'http://localhost/' };
const mockStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

Object.defineProperty(globalThis, 'window', { value: globalThis });
Object.defineProperty(globalThis, 'location', { value: mockLocation });
Object.defineProperty(globalThis, 'localStorage', { value: mockStorage });
Object.defineProperty(globalThis, 'addEventListener', { value: () => {} });
// ... etc
```

### 2. DOM Shim Installation

After mocking browser globals, the Lit SSR DOM shim is installed:

```typescript
import '@lit-labs/ssr/lib/install-global-dom-shim.js';
```

This provides a minimal DOM implementation that Lit needs for SSR.

### 3. SSR-Compatible Component Design

The real `app-login.ts` component is imported directly. To make this work, the component uses **dynamic imports** for browser-only dependencies like the router:

```typescript
// In app-login.ts - dynamic import instead of static
const getRouter = () => import('../utils/router').then(m => m.router);

// Used in methods:
async explore() {
  const router = await getRouter();
  router.navigate('/explore');
}
```

This pattern ensures:
- ✅ The router is only loaded in the browser
- ✅ SSR can render the component without router errors
- ✅ No duplicate component definitions to maintain

### 4. Rendering with Lit SSR

The component is rendered to an HTML string using Lit's SSR utilities:

```typescript
import { render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';

const template = html`<app-login></app-login>`;
const result = render(template);
const skeletonHtml = await collectResult(result);
```

The output includes **Declarative Shadow DOM**, so the component's shadow root and styles are embedded in the HTML:

```html
<app-login>
  <template shadowroot="open" shadowrootmode="open">
    <style>/* component styles */</style>
    <main>
      <md-card>
        <template shadowroot="open" shadowrootmode="open">
          <!-- md-card shadow DOM -->
        </template>
        <!-- card content -->
      </md-card>
    </main>
  </template>
</app-login>
```

### 5. Injection into index.html

The skeleton HTML is injected into the built `dist/index.html`:

```typescript
indexHtml = indexHtml.replace(
  /<app-index><\/app-index>/,
  `<app-index>${skeletonHtml}</app-index>`
);
```

**Before:**
```html
<app-index></app-index>
```

**After:**
```html
<app-index>
  <app-login>
    <template shadowroot="open" shadowrootmode="open">
      <!-- Full pre-rendered login page -->
    </template>
  </app-login>
</app-index>
```

## Build Integration

The skeleton generation runs automatically as part of `npm run build`:

```json
{
  "scripts": {
    "build": "tsc && vite build && tsx scripts/generate-ssr-skeleton.ts"
  }
}
```

1. **TypeScript compile** - Type checking
2. **Vite build** - Bundle JS/CSS, output to `dist/`
3. **SSR skeleton** - Generate and inject skeleton into `dist/index.html`

## Output Files

After build, you'll find:

| File | Description |
|------|-------------|
| `dist/index.html` | Production HTML with skeleton injected |
| `dist/login-skeleton.html` | Raw skeleton HTML (for debugging) |

## Why Build-Time SSR?

We chose build-time over runtime SSR because:

1. **Simpler deployment** - No Node.js server needed, works with static hosting
2. **No browser API issues** - Router, localStorage, etc. don't run at request time
3. **Zero runtime cost** - HTML is pre-generated, no SSR latency
4. **Perfect for SPA** - The skeleton is just a loading state, not SEO content

## Making Components SSR-Compatible

To make a component work with SSR, follow these patterns:

### Dynamic Imports for Browser-Only Code

```typescript
// ❌ BAD - static import breaks SSR
import { router } from '../utils/router';

// ✅ GOOD - dynamic import, only loaded in browser
const getRouter = () => import('../utils/router').then(m => m.router);
```

### Guard Browser APIs in Lifecycle Methods

```typescript
async firstUpdated() {
  // These only run in browser, not during SSR
  const urlParams = new URLSearchParams(window.location.search);
  // ...
}
```

### No Top-Level Browser API Access

```typescript
// ❌ BAD - runs at module load, breaks SSR
const token = localStorage.getItem('token');

// ✅ GOOD - access in method, only runs in browser
getToken() {
  return localStorage.getItem('token');
}
```

## Troubleshooting

### "X is not defined" errors

If you see errors about missing browser APIs, add mocks at the top of the SSR script:

```typescript
Object.defineProperty(globalThis, 'missingAPI', {
  value: /* mock implementation */,
  writable: true,
  configurable: true
});
```

### Component not rendering

Ensure the component:
1. Uses dynamic imports for browser-only dependencies
2. Doesn't access browser APIs at module level
3. Is properly exported and uses `@customElement()` decorator

### Skeleton not appearing

Check that:
1. `dist/index.html` contains `<app-index>` (the injection target)
2. The build completed without errors
3. The `dist/login-skeleton.html` file was generated

## Dependencies

| Package | Purpose |
|---------|---------|
| `@lit-labs/ssr` | Server-side rendering for Lit |
| `tsx` | Run TypeScript directly in Node.js |
| `lit` | Web component framework |
