# Thread Handling Fixes - Implementation Plan

## Overview
Fix critical issues with how threads are displayed and handled in the timeline and timeline-item components.

## Problems Identified

### 1. Incomplete Thread Display in Timeline
- **Current**: Only fetches immediate parent post via `getAStatus(in_reply_to_id)`
- **Issue**: Doesn't show full thread chain - if parent is also a reply, the chain is broken
- **Location**: `src/components/timeline-item.ts` lines 335-345

### 2. Thread Context API Not Used Properly
- **Current**: `getReplies()` uses `/context` endpoint but only used in post-detail
- **Issue**: Context API returns both `ancestors` and `descendants` but timeline doesn't use it
- **Location**: `src/pages/post-detail.ts` only uses `descendants`, ignores `ancestors`

### 3. No Visual Thread Hierarchy
- **Current**: Flat list with small "Thread" indicator
- **Issue**: No clear visual connection for:
  - Multiple levels of thread depth
  - Sibling posts in thread
  - Full conversation flow

### 4. Reblog/Boost Breaks Thread Context
- **Current**: Shows reblogged content but ignores thread context of original
- **Issue**: Can't see if reblogged post is part of a thread
- **Location**: `src/components/timeline-item.ts` lines 895-989

### 5. Post Interface Missing Thread Data
- **Current**: Only has `reply_to: Post` (singular)
- **Issue**: Can't store arrays of `ancestors` or `descendants`
- **Location**: `src/interfaces/Post.ts`

### 6. Inefficient Single-Status Fetching
- **Current**: Individual API calls for each parent
- **Issue**: Should use `/context` endpoint for entire thread in one call

## Implementation Plan

### Phase 1: Update Data Structures
- [ ] Add `ancestors?: Post[]` to Post interface
- [ ] Add `descendants?: Post[]` to Post interface
- [ ] Add `context?: { ancestors: Post[], descendants: Post[] }` to Post interface

### Phase 2: Update Services
- [ ] Create `getContext(id: string)` service function that calls Mastodon context API directly
- [ ] Update timeline-item to use context API instead of single status fetch
- [ ] Add caching for thread context to avoid redundant API calls

### Phase 3: Update Timeline Item Component
- [ ] Replace `getAStatus()` call with `getContext()` call in `firstUpdated()`
- [ ] Store full ancestors array instead of single `reply_to`
- [ ] Add logic to handle reblogged posts that are part of threads
- [ ] Add thread expansion state management

### Phase 4: Visual Thread Display
- [ ] Add CSS for thread visualization (connecting lines, indentation)
- [ ] Create collapsible thread UI (show/hide ancestors)
- [ ] Add "View full thread" button
- [ ] Add visual indicators for thread depth
- [ ] Style thread hierarchy with proper spacing and indentation

### Phase 5: Update Post Detail Page
- [ ] Show ancestors (posts above) in addition to descendants (replies below)
- [ ] Display full thread context when viewing individual post
- [ ] Add proper ordering (ancestors first, current post, then descendants)

### Phase 6: Performance Optimizations
- [ ] Implement thread context caching in IndexedDB
- [ ] Lazy load thread ancestors (only fetch when user expands)
- [ ] Add intersection observer for thread loading
- [ ] Debounce thread context API calls

## Success Criteria
- [ ] Clicking on a reply shows the full thread chain above it
- [ ] Thread hierarchy is visually clear with connecting lines or indentation
- [ ] Reblogged posts show their thread context
- [ ] Post detail page shows both ancestors and descendants
- [ ] Performance: Thread loading doesn't slow down timeline scrolling
- [ ] UI: Thread expansion/collapse works smoothly

## API Endpoints Used
- `/api/v1/statuses/:id/context` - Returns ancestors and descendants
- `/api/v1/statuses/:id` - Returns single status (still needed for other features)

## Notes
- Mastodon's context API returns: `{ ancestors: Post[], descendants: Post[] }`
- Ancestors are ordered from oldest to newest (thread root first)
- Descendants may include nested replies (tree structure)
- Need to handle edge case: very long threads (performance consideration)
