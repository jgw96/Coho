import { LitElement, PropertyValues, TemplateResult } from 'lit';
/**
 * md-virtual-list - High-performance virtual scrolling list
 *
 * Uses direct DOM management for the item pool to avoid Lit re-render flickering.
 * Items are recycled and repositioned without triggering framework updates.
 */
export declare class MdVirtualList extends LitElement {
    static styles: import("lit").CSSResult;
    items: any[];
    renderItem: (item: any, index?: number) => TemplateResult;
    keyFn: (item: any) => string | number;
    estimatedItemHeight: number;
    overscan: number;
    loadMoreThreshold: number;
    loading: boolean;
    private _totalHeight;
    private _heights;
    private _tops;
    private _scrollContainer;
    private _spacerElement;
    private _itemPool;
    private _renderedKeys;
    private _scrollRAF;
    private _containerResizeObserver;
    private _itemResizeObserver;
    private _loadMoreObserver;
    private _isLoadingMore;
    private _lastScrollTop;
    private _containerHeight;
    private _isInitialized;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected firstUpdated(_changedProperties: PropertyValues): void;
    protected updated(changedProperties: PropertyValues): void;
    private _setupItemResizeObserver;
    private _setupContainerResizeObserver;
    private _setupLoadMoreObserver;
    private _onScroll;
    private _initializeHeights;
    private _handleItemsChanged;
    private _cleanupRemovedItems;
    private _recalculatePositions;
    private _updateAllItemPositions;
    private _syncVisibleItems;
    private _binarySearchStart;
    private _binarySearchEnd;
    private _triggerLoadMore;
    scrollToIndex(index: number, behavior?: ScrollBehavior): void;
    scrollToTop(behavior?: ScrollBehavior): void;
    getScrollContainer(): HTMLElement | null;
    getScrollTop(): number;
    setScrollTop(position: number): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-virtual-list': MdVirtualList;
    }
}
