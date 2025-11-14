# Service Worker Setup Audit & Fixes

## Issues Found & Fixed

### ✅ 1. VitePWA Configuration (FIXED)
**Problem:** Incomplete configuration for `injectManifest` strategy
- Missing proper glob patterns for all asset types
- No file size limit specified
- Missing dev mode type specification

**Fix Applied:**
- Added comprehensive glob patterns including images, fonts, and all asset directories
- Set 5MB file size limit for caching
- Added `type: 'module'` to dev options
- Added glob ignores for node_modules

---

### ⚠️ 2. Duplicate Service Worker Registration Files

**Current State:**
- `public/register-sw.mjs` - Unused file with Workbox window registration
- `index.html` - Inline script with manual Workbox registration

**Issue:**
- Two different registration implementations exist
- `register-sw.mjs` is built to `dist/` but never imported
- `index.html` duplicates the registration logic inline

**Recommendation:**
Choose ONE approach:

#### Option A: Use External Module (Cleaner)
1. Delete the inline registration script from `index.html`
2. Import `register-sw.mjs` as a module:
```html
<script type="module" src="/register-sw.mjs"></script>
```

#### Option B: Keep Inline (Current)
1. Delete `public/register-sw.mjs` entirely
2. Keep the inline script in `index.html`

**Recommended:** Option A - Keeps HTML cleaner and allows better code organization

---

### ⚠️ 3. Workbox Import Strategy

**Current State:**
`public/sw.js` uses ES module imports at the top:
```javascript
import { NetworkOnly, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
// etc.
```

**Issue:**
When VitePWA processes the service worker with `injectManifest`, these imports need to be bundled. The current build may not be handling this correctly.

**Verification Needed:**
Check if the built `dist/sw.js` properly bundles all Workbox dependencies or if it still has import statements.

**Potential Fix:**
If imports aren't being bundled, you have two options:

#### Option A: Let Vite Bundle (Modern)
Update `vite.config.ts`:
```typescript
VitePWA({
  strategies: 'injectManifest',
  injectManifest: {
    rollupFormat: 'iife', // Bundle as IIFE
    // ... rest of config
  }
})
```

#### Option B: Use importScripts (Traditional)
Replace ES imports with:
```javascript
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);
const { NetworkOnly, CacheFirst, NetworkFirst } = workbox.strategies;
// etc.
```

---

### ℹ️ 4. Service Worker Registration Flow

**Current Flow:**
1. `index.html` loads
2. Inline script imports Workbox from CDN: `workbox-window.prod.mjs`
3. Creates new `Workbox('/sw.js')` instance
4. Registers with update prompting logic
5. Service Worker at `/sw.js` activates

**This is CORRECT**, but should be moved to external module for cleanliness.

---

### ℹ️ 5. Manifest Injection Verification

**How to Verify Fix:**
After rebuilding, check `dist/sw.js`:

```bash
npm run build
grep -A 5 "precacheAndRoute" dist/sw.js
```

**Expected Output:**
Should see an array of objects with `revision` and `url` properties, NOT `self.__WB_MANIFEST`.

**Example of CORRECT output:**
```javascript
precacheAndRoute([
  {revision:"abc123",url:"index.html"},
  {revision:"def456",url:"code/app-home.js"},
  // ... more files
])
```

**Example of BROKEN output:**
```javascript
precacheAndRoute(self.__WB_MANIFEST || [])
```

---

## Action Items

### Immediate (Do Now):
1. ✅ **VitePWA config updated** - Rebuild and test
2. **Choose registration approach** - External module OR inline (recommend external)
3. **Verify manifest injection** - Run build and check output

### Testing (After Fixes):
```bash
# Clean build
rm -rf dist/
npm run build

# Verify service worker
grep "precacheAndRoute" dist/sw.js | head -20

# Check if Workbox modules are bundled
grep "workbox-strategies" dist/sw.js

# Verify registration file
ls -lh dist/register-sw.mjs
```

### Optional Improvements:
1. Add TypeScript types for service worker (`sw.d.ts`)
2. Add service worker in development mode for testing
3. Set up service worker debugging in dev tools
4. Add versioning to cache names

---

## Current Service Worker Features (All Good ✅)

These features are correctly implemented:
- ✅ Workbox precaching with manifest injection
- ✅ Background sync for failed requests
- ✅ Push notifications handling
- ✅ Periodic background sync
- ✅ Share target API
- ✅ Windows PWA widgets
- ✅ Update prompts with skip waiting
- ✅ Multiple caching strategies (NetworkFirst, CacheFirst, NetworkOnly)
- ✅ Cache expiration policies
- ✅ Navigation preload
- ✅ IndexedDB for token storage (idb-keyval)

---

## Build Process Flow

### Current (After Fix):
1. **Dev:** `npm run dev`
   - Vite serves app on port 3000
   - VitePWA dev mode serves service worker
   - Hot reload works

2. **Build:** `npm run build`
   - TypeScript compilation (`tsc`)
   - Vite builds app to `dist/`
   - VitePWA processes `public/sw.js`:
     - Scans `dist/` for files matching glob patterns
     - Generates precache manifest
     - Injects manifest into `sw.js` replacing `self.__WB_MANIFEST`
     - Outputs to `dist/sw.js`
   - Copy plugin moves CSS files to `dist/`

3. **Deploy:**
   - Upload entire `dist/` directory
   - Service worker available at `/sw.js`
   - Registration happens on first page load

---

## Service Worker Lifecycle

```
User visits site
    ↓
index.html loads
    ↓
Registration script runs
    ↓
navigator.serviceWorker.register('/sw.js')
    ↓
Service worker downloads
    ↓
Service worker installs
    ├─ Precaches files from manifest
    └─ Waits for activation
    ↓
Service worker activates
    ├─ Deletes old caches
    └─ Takes control of pages
    ↓
Service worker intercepts requests
    ├─ Navigation → NetworkFirst
    ├─ API calls → NetworkFirst with expiration
    ├─ Images → CacheFirst
    └─ Static assets → Precached
```

---

## Recommendations Summary

**Priority 1 (Critical):**
- [x] Fix VitePWA configuration (DONE)
- [ ] Rebuild and verify manifest injection
- [ ] Clean up duplicate registration (choose one approach)

**Priority 2 (Important):**
- [ ] Verify Workbox modules are bundled correctly
- [ ] Test update flow in production

**Priority 3 (Nice to Have):**
- [ ] Add service worker TypeScript types
- [ ] Improve error handling in SW
- [ ] Add SW debugging utilities

---

## Testing Checklist

After applying fixes, test:
- [ ] Clean install works (no service worker → install SW)
- [ ] Update flow works (old SW → new SW with prompt)
- [ ] Offline mode works (cache serves content)
- [ ] Background sync works (failed requests retry)
- [ ] Push notifications work
- [ ] Share target works
- [ ] Cache expiration works (old entries deleted)
