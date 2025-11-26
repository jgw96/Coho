import { LitElement, html, css, PropertyValues, TemplateResult, nothing, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * md-virtual-list - High-performance virtual scrolling list
 *
 * Uses direct DOM management for the item pool to avoid Lit re-render flickering.
 * Items are recycled and repositioned without triggering framework updates.
 */
@customElement('md-virtual-list')
export class MdVirtualList extends LitElement {
    static styles = css`
    :host {
      display: block;
      height: 100%;
      overflow: hidden;
      contain: strict;
    }

    .scroll-container {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior-y: contain;
      overflow-anchor: none; /* Disable native anchoring - we handle it */
    }

    .virtual-spacer {
      position: relative;
      width: 100%;
    }

    .virtual-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      contain: layout style paint;
      will-change: transform;
    }

    .sentinel {
      position: absolute;
      bottom: 0;
      height: 1px;
      width: 100%;
      pointer-events: none;
    }

    .loading-indicator {
      display: flex;
      justify-content: center;
      padding: 16px;
    }

    .scroll-container::-webkit-scrollbar {
      width: var(--md-sys-scrollbar-width, 8px);
    }

    .scroll-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background: var(--md-sys-scrollbar-thumb-color, rgba(0, 0, 0, 0.15));
      border-radius: 4px;
    }

    @media (prefers-color-scheme: dark) {
      .scroll-container::-webkit-scrollbar-thumb {
        background: var(--md-sys-scrollbar-thumb-color, rgba(255, 255, 255, 0.15));
      }
    }
  `;

    @property({ type: Array }) items: any[] = [];
    @property({ attribute: false }) renderItem: (item: any, index?: number) => TemplateResult = () => html``;
    @property({ attribute: false }) keyFn: (item: any) => string | number = (item) => item?.id ?? Math.random();
    @property({ type: Number }) estimatedItemHeight: number = 400;
    @property({ type: Number }) overscan: number = 5;
    @property({ type: Number }) loadMoreThreshold: number = 500;
    @property({ type: Boolean }) loading: boolean = false;

    @state() private _totalHeight = 0;

    // Height/position tracking
    private _heights: number[] = [];
    private _tops: number[] = [];

    // DOM references
    private _scrollContainer: HTMLElement | null = null;
    private _spacerElement: HTMLElement | null = null;

    // Item pool - reusable DOM elements
    private _itemPool: Map<string | number, HTMLElement> = new Map();
    private _renderedKeys: Set<string | number> = new Set();

    // Observers and state
    private _scrollRAF: number | null = null;
    private _containerResizeObserver: ResizeObserver | null = null;
    private _itemResizeObserver: ResizeObserver | null = null;
    private _loadMoreObserver: IntersectionObserver | null = null;
    private _isLoadingMore = false;
    private _lastScrollTop = 0;
    private _containerHeight = 0;
    private _isInitialized = false;

    connectedCallback() {
        super.connectedCallback();
        this._setupItemResizeObserver();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._scrollRAF) cancelAnimationFrame(this._scrollRAF);
        this._containerResizeObserver?.disconnect();
        this._itemResizeObserver?.disconnect();
        this._loadMoreObserver?.disconnect();
        this._scrollContainer?.removeEventListener('scroll', this._onScroll);
        this._itemPool.clear();
        this._renderedKeys.clear();
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this._scrollContainer = this.shadowRoot?.querySelector('.scroll-container') as HTMLElement;
        this._spacerElement = this.shadowRoot?.querySelector('.virtual-spacer') as HTMLElement;

        if (this._scrollContainer && this._spacerElement) {
            this._scrollContainer.addEventListener('scroll', this._onScroll, { passive: true });
            this._containerHeight = this._scrollContainer.clientHeight;
            this._setupContainerResizeObserver();
            this._initializeHeights();
            this._isInitialized = true;
            this._syncVisibleItems();

            // Setup load more observer
            this.updateComplete.then(() => this._setupLoadMoreObserver());
        }
    }

    protected updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);

        if (changedProperties.has('items') && this._isInitialized) {
            this._handleItemsChanged();
        }

        if (changedProperties.has('loading') && !this.loading) {
            this._isLoadingMore = false;
        }
    }

    private _setupItemResizeObserver() {
        this._itemResizeObserver = new ResizeObserver((entries) => {
            let needsUpdate = false;
            let scrollDelta = 0;

            // Get current scroll position directly from DOM
            const currentScrollTop = this._scrollContainer?.scrollTop ?? 0;
            const firstVisibleIndex = this._binarySearchStart(currentScrollTop);

            for (const entry of entries) {
                const el = entry.target as HTMLElement;
                const indexStr = el.dataset.index;
                if (indexStr === undefined) continue;

                const index = parseInt(indexStr, 10);
                if (isNaN(index) || index < 0 || index >= this.items.length) continue;

                const newHeight = Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height);
                const currentHeight = this._heights[index] ?? this.estimatedItemHeight;
                const heightDiff = newHeight - currentHeight;

                if (Math.abs(heightDiff) > 1) {
                    this._heights[index] = newHeight;
                    needsUpdate = true;

                    // If this item is above the first visible item, accumulate scroll adjustment
                    if (index < firstVisibleIndex) {
                        scrollDelta += heightDiff;
                    }
                }
            }

            if (needsUpdate) {
                this._recalculatePositions();
                this._updateAllItemPositions();

                // Apply scroll correction for height changes above viewport
                // Use scrollBy for better cross-browser compatibility
                if (scrollDelta !== 0 && this._scrollContainer && Math.abs(scrollDelta) < 2000) {
                    // Temporarily remove scroll listener to prevent feedback loop
                    this._scrollContainer.removeEventListener('scroll', this._onScroll);

                    this._scrollContainer.scrollBy({ top: scrollDelta, behavior: 'instant' });
                    this._lastScrollTop = this._scrollContainer.scrollTop;

                    // Re-add scroll listener on next frame
                    requestAnimationFrame(() => {
                        this._scrollContainer?.addEventListener('scroll', this._onScroll, { passive: true });
                    });
                }
            }
        });
    }

    private _setupContainerResizeObserver() {
        if (!this._scrollContainer) return;

        this._containerResizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const newHeight = entry.contentRect.height;
                if (Math.abs(newHeight - this._containerHeight) > 1) {
                    this._containerHeight = newHeight;
                    this._syncVisibleItems();
                }
            }
        });
        this._containerResizeObserver.observe(this._scrollContainer);
    }

    private _setupLoadMoreObserver() {
        const sentinel = this.shadowRoot?.querySelector('.sentinel');
        if (!sentinel || !this._scrollContainer) return;

        this._loadMoreObserver?.disconnect();

        this._loadMoreObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && !this._isLoadingMore && !this.loading && this.items.length > 0) {
                        this._triggerLoadMore();
                    }
                }
            },
            {
                root: this._scrollContainer,
                rootMargin: `${this.loadMoreThreshold}px`,
                threshold: 0
            }
        );
        this._loadMoreObserver.observe(sentinel);
    }

    private _onScroll = () => {
        if (this._scrollRAF) return;

        this._scrollRAF = requestAnimationFrame(() => {
            this._scrollRAF = null;
            if (this._scrollContainer) {
                this._lastScrollTop = this._scrollContainer.scrollTop;
                this._syncVisibleItems();
            }
        });
    };

    private _initializeHeights() {
        this._heights = new Array(this.items.length).fill(this.estimatedItemHeight);
        this._recalculatePositions();
    }

    private _handleItemsChanged() {
        const oldLength = this._heights.length;
        const newLength = this.items.length;

        if (newLength > oldLength) {
            for (let i = oldLength; i < newLength; i++) {
                this._heights[i] = this.estimatedItemHeight;
            }
        } else if (newLength < oldLength) {
            this._heights.length = newLength;
            // Clean up pool entries for removed items
            this._cleanupRemovedItems();
        }

        this._recalculatePositions();
        this._syncVisibleItems();
    }

    private _cleanupRemovedItems() {
        // Remove pool entries for items that no longer exist
        for (const [key, el] of this._itemPool) {
            const indexStr = el.dataset.index;
            if (indexStr) {
                const index = parseInt(indexStr, 10);
                if (index >= this.items.length) {
                    this._itemResizeObserver?.unobserve(el);
                    el.remove();
                    this._itemPool.delete(key);
                    this._renderedKeys.delete(key);
                }
            }
        }
    }

    private _recalculatePositions() {
        this._tops = new Array(this.items.length);
        let currentTop = 0;

        for (let i = 0; i < this.items.length; i++) {
            this._tops[i] = currentTop;
            currentTop += this._heights[i] ?? this.estimatedItemHeight;
        }

        this._totalHeight = currentTop;

        // Update spacer height directly
        if (this._spacerElement) {
            this._spacerElement.style.height = `${this._totalHeight}px`;
        }
    }

    private _updateAllItemPositions() {
        // Update positions of all currently rendered items using transforms
        for (const [, el] of this._itemPool) {
            const indexStr = el.dataset.index;
            if (indexStr) {
                const index = parseInt(indexStr, 10);
                const top = this._tops[index];
                if (top !== undefined) {
                    el.style.transform = `translateY(${top}px)`;
                }
            }
        }
    }

    private _syncVisibleItems() {
        if (!this._spacerElement || this.items.length === 0) return;

        const scrollTop = this._lastScrollTop;
        const viewportBottom = scrollTop + this._containerHeight;

        // Calculate visible range
        let startIndex = this._binarySearchStart(scrollTop);
        let endIndex = this._binarySearchEnd(viewportBottom);

        // Apply symmetric overscan
        startIndex = Math.max(0, startIndex - this.overscan);
        endIndex = Math.min(this.items.length - 1, endIndex + this.overscan);

        // Determine which keys should be visible
        const targetKeys = new Set<string | number>();
        for (let i = startIndex; i <= endIndex; i++) {
            const item = this.items[i];
            if (item) {
                targetKeys.add(this.keyFn(item));
            }
        }

        // Remove items that are no longer visible
        for (const [key, el] of this._itemPool) {
            if (!targetKeys.has(key)) {
                this._itemResizeObserver?.unobserve(el);
                el.remove();
                this._itemPool.delete(key);
                this._renderedKeys.delete(key);
            }
        }

        // Add/update items that should be visible
        for (let i = startIndex; i <= endIndex; i++) {
            const item = this.items[i];
            if (!item) continue;

            const key = this.keyFn(item);
            const top = this._tops[i] ?? 0;

            let el = this._itemPool.get(key);

            if (el) {
                // Element exists - just update position and index if needed
                if (el.dataset.index !== String(i)) {
                    el.dataset.index = String(i);
                }
                el.style.transform = `translateY(${top}px)`;
            } else {
                // Create new element
                el = document.createElement('div');
                el.className = 'virtual-item';
                el.dataset.index = String(i);
                el.dataset.key = String(key);
                el.style.transform = `translateY(${top}px)`;

                // Render content into element
                render(this.renderItem(item, i), el);

                // Add to DOM before sentinel
                const sentinel = this._spacerElement.querySelector('.sentinel');
                this._spacerElement.insertBefore(el, sentinel);

                // Start observing for size changes
                this._itemResizeObserver?.observe(el);

                // Track in pool
                this._itemPool.set(key, el);
                this._renderedKeys.add(key);
            }
        }
    }

    private _binarySearchStart(scrollTop: number): number {
        let low = 0;
        let high = this.items.length - 1;

        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            const itemBottom = (this._tops[mid] ?? 0) + (this._heights[mid] ?? this.estimatedItemHeight);

            if (itemBottom <= scrollTop) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }

        return low;
    }

    private _binarySearchEnd(viewportBottom: number): number {
        let low = 0;
        let high = this.items.length - 1;

        while (low < high) {
            const mid = Math.floor((low + high + 1) / 2);
            const itemTop = this._tops[mid] ?? 0;

            if (itemTop < viewportBottom) {
                low = mid;
            } else {
                high = mid - 1;
            }
        }

        return low;
    }

    private _triggerLoadMore() {
        if (this._isLoadingMore) return;
        this._isLoadingMore = true;
        this.dispatchEvent(new CustomEvent('load-more', { bubbles: true, composed: true }));
    }

    public scrollToIndex(index: number, behavior: ScrollBehavior = 'auto') {
        if (index < 0 || index >= this.items.length || !this._scrollContainer) return;
        const top = this._tops[index] ?? 0;
        this._scrollContainer.scrollTo({ top, behavior });
    }

    public scrollToTop(behavior: ScrollBehavior = 'smooth') {
        this._scrollContainer?.scrollTo({ top: 0, behavior });
    }

    public getScrollContainer(): HTMLElement | null {
        return this._scrollContainer;
    }

    public getScrollTop(): number {
        return this._scrollContainer?.scrollTop ?? 0;
    }

    public setScrollTop(position: number) {
        if (this._scrollContainer) {
            this._scrollContainer.scrollTop = position;
            this._lastScrollTop = position;
            this._syncVisibleItems();
        }
    }

    render() {
        // Minimal render - just the container structure
        // Items are managed directly via _syncVisibleItems()
        return html`
      <div class="scroll-container" part="scroll-container">
        <div class="virtual-spacer" style="height: ${this._totalHeight}px;">
          <div class="sentinel" aria-hidden="true"></div>
        </div>
        ${this.loading || this._isLoadingMore
                ? html`<div class="loading-indicator"><slot name="loading">Loading...</slot></div>`
                : nothing}
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'md-virtual-list': MdVirtualList;
    }
}
