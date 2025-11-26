import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  getLastPlaceTimeline,
  getPaginatedHomeTimeline,
  getPreviewTimeline,
  mixTimeline,
} from '../services/timeline';
import {
  saveTimelineCache,
  getTimelineCache,
  updateCacheScrollPosition,
  clearTimelineCache,
} from '../services/timeline-cache';

// @ts-expect-error fix
import TimelineWorker from '../utils/timeline-worker?worker';

import '../components/md/md-dialog';
import '../components/md/md-button';
import '../components/md/md-icon';
import '../components/md/md-skeleton-card';

import '@lit-labs/virtualizer';

import '../components/timeline-item';
import '../components/search';
import '../components/md/md-select';
import '../components/md/md-option';
import { Post } from '../interfaces/Post';

import { router } from '../utils/router';

@customElement('app-timeline')
export class Timeline extends LitElement {
  @state() timeline: Post[] = [];
  @state() loadingData: boolean = false;
  @state() lastScrollPosition: number = 0;

  @state() imgPreview: string | undefined = undefined;

  @state() analyzeData: any | undefined = undefined;
  @state() imageDesc: string | undefined = undefined;
  @state() analyzeTweet: Post | null = null;

  @state() isRefreshing: boolean = false;
  private _pullStartY: number = 0;
  private _isPulling: boolean = false;
  private _pullDistance: number = 0;
  private _threshold: number = 80;
  private _hapticTriggered: boolean = false;

  @property({ type: String }) timelineType:
    | 'home'
    | 'public'
    | 'media'
    | 'for you'
    | 'home and some trending' = 'home';

  static styles = [
    css`
      :host {
        display: block;
      }

      md-dialog::part(base) {
        z-index: 99999;
      }

      #mainList li {
        width: 100%;
      }

      timeline-item {
        margin-bottom: 30px;
      }

      .timeline-list-item {
        border-bottom: solid 1px #80808063;
      }

      #list-actions {
        display: none;
        margin-bottom: 12px;

        background: var(--sl-panel-background-color);
        padding: 8px;
        border-radius: 4px;

        align-items: center;
        justify-content: space-between;
      }

      md-button {
        border: none;
      }

      #timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        gap: 12px;
        padding-left: 10px;
      }

      #timeline-header md-select {
        flex: 1;
        max-width: 300px;
      }

      @media (prefers-color-scheme: dark) {
        md-button::part(control) {
          --neutral-fill-rest: #242428;
          --netural-fill-stealth-active: #242428;
          color: white;
          border: none;
        }
      }

      #learn-more-header {
        padding-top: 0;
        margin-top: 0;
      }

      #img-preview {
        --width: 80vw;
      }

      #img-preview::part(panel) {
        height: 90vh;
      }

      #img-preview img {
        width: 100%;
        height: max-content;
        border-radius: 6px;
      }

      ul {
        display: flex;
        flex-direction: column;
        border-radius: 6px;
        margin: 0;
        padding: 0;
        list-style: none;

        height: 84vh;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      lit-virtualizer {
        height: calc(84vh - 60px);
        overflow-x: hidden !important;
      }

      #load-more {
        margin: 16px auto;
        display: block;
      }

      sl-card {
        --padding: 10px;
      }

      li {
        animation-name: fadein;
        animation-duration: 0.3s;
      }

      .header-block {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .header-block img {
        height: 62px;
        border-radius: 50%;
      }

      .header-block h4 {
        margin-bottom: 0;
      }

      .actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .fake sl-skeleton {
        height: 302px;
        --border-radius: var(--sl-border-radius-medium);
      }

      .fake {
        margin-bottom: 8px;
        animation-name: fadein;
        animation-duration: 0.3s;
      }

      #analyze ul {
        max-height: 200px;
        max-width: 390px;
        height: initial;
      }

      #analyze ul li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
        background: var(--primary-color);
        border-radius: 6px;
        padding: 8px;
      }

      #analyze::part(panel) {
        --width: 90vw;
        height: 90vh;
      }

      #analyze::part(body) {
        display: grid;
        grid-template-columns: 29% 69%;
        gap: 16px;
      }

      #analyze timeline-item::part(image) {
        height: 200px;
      }

      #analyze timeline-item {
        overflow: hidden;
      }

      ul {
        overscroll-behavior-y: contain;
        position: relative;
      }

      #refresh-indicator {
        height: 0;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        transition: height 0.2s ease;
        flex-shrink: 0;
        z-index: 100;
        position: relative;
      }

      #refresh-indicator md-icon {
        transform: rotate(0deg);
        transition: transform 0.2s ease;
        width: 32px;
        height: 32px;
        font-size: 32px;
        color: var(--md-sys-color-primary);
      }

      #refresh-indicator.refreshing {
        height: 60px;
      }

      #refresh-indicator.refreshing md-icon {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        100% {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 820px) {
        ul {
          height: 85vh;
        }

        lit-virtualizer {
          height: 80vh;
        }

        #refresh-manual-button {
          display: none;
        }
      }

      @keyframes fadein {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `,
  ];

  firstUpdated() {
    const scrollContainer = this.shadowRoot?.querySelector(
      '#mainList'
    ) as HTMLElement;
    if (scrollContainer) {
      scrollContainer.addEventListener(
        'touchstart',
        this._handleTouchStart.bind(this),
        { passive: true }
      );
      scrollContainer.addEventListener(
        'touchmove',
        this._handleTouchMove.bind(this),
        { passive: false }
      );
      scrollContainer.addEventListener(
        'touchend',
        this._handleTouchEnd.bind(this),
        { passive: true }
      );
    }
  }

  _handleTouchStart(e: TouchEvent) {
    const scrollContainer = this.shadowRoot?.querySelector(
      '#mainList'
    ) as HTMLElement;
    if (scrollContainer.scrollTop === 0) {
      this._pullStartY = e.touches[0].clientY;
      this._isPulling = true;
    }
  }

  _handleTouchMove(e: TouchEvent) {
    if (!this._isPulling) return;

    const scrollContainer = this.shadowRoot?.querySelector(
      '#mainList'
    ) as HTMLElement;
    if (scrollContainer.scrollTop > 0) {
      this._isPulling = false;
      return;
    }

    const y = e.touches[0].clientY;
    const deltaY = y - this._pullStartY;

    if (deltaY > 0) {
      if (e.cancelable) e.preventDefault();

      this._pullDistance = deltaY * 0.5;

      const indicator = this.shadowRoot?.querySelector(
        '#refresh-indicator'
      ) as HTMLElement;
      const icon = indicator?.querySelector('md-icon') as HTMLElement;

      if (indicator) {
        indicator.style.height = `${Math.min(this._pullDistance, 150)}px`;
        indicator.style.transition = 'none'; // Disable transition during drag
      }

      if (icon) {
        const rotation = Math.min(
          (this._pullDistance / this._threshold) * 360,
          360
        );
        icon.style.transform = `rotate(${rotation}deg)`;
      }

      if (this._pullDistance >= this._threshold && !this._hapticTriggered) {
        if (navigator.vibrate) navigator.vibrate(10);
        this._hapticTriggered = true;
      } else if (this._pullDistance < this._threshold) {
        this._hapticTriggered = false;
      }
    }
  }

  async _handleTouchEnd() {
    if (!this._isPulling) return;
    this._isPulling = false;
    this._hapticTriggered = false;

    const indicator = this.shadowRoot?.querySelector(
      '#refresh-indicator'
    ) as HTMLElement;
    if (indicator) {
      indicator.style.transition = 'height 0.2s ease'; // Re-enable transition
    }

    if (this._pullDistance >= this._threshold) {
      this.isRefreshing = true;
      if (indicator) indicator.classList.add('refreshing');

      // Reset height to fixed loading height
      if (indicator) indicator.style.height = '60px';

      await this.refreshTimeline(true);

      this.isRefreshing = false;
      if (indicator) {
        indicator.classList.remove('refreshing');
        indicator.style.height = '0px';
      }
    } else {
      if (indicator) indicator.style.height = '0px';
    }

    this._pullDistance = 0;
  }

  async connectedCallback() {
    super.connectedCallback();

    const { get } = await import('idb-keyval');
    const savedTimelineType = await get('timelineType');

    console.log('saved timeline type', savedTimelineType);

    if (savedTimelineType) {
      this.timelineType = savedTimelineType;
    }

    // Check cache first
    const cachedTimeline = getTimelineCache(this.timelineType);
    if (cachedTimeline && cachedTimeline.data.length > 0) {
      console.log('Restoring timeline from cache');
      this.timeline = cachedTimeline.data;
      this.loadingData = false;

      // Restore scroll position after render
      await this.updateComplete;
      requestAnimationFrame(() => {
        const scrollContainer = this.shadowRoot?.querySelector(
          '#mainList'
        ) as HTMLElement;
        if (scrollContainer && cachedTimeline.scrollPosition > 0) {
          scrollContainer.scrollTop = cachedTimeline.scrollPosition;
          console.log(
            'Restored scroll position:',
            cachedTimeline.scrollPosition
          );
        }
      });
    } else {
      // No cache, fetch fresh data
      console.log('No cache found, fetching fresh timeline');
      this.loadingData = true;
      await this.refreshTimeline();
      this.loadingData = false;
    }

    // if (latestReadID && this.timelineType === "for you" && index > 0) {
    //     const virtualizer: any = this.shadowRoot?.querySelector('lit-virtualizer');

    //     console.log("check this", virtualizer?.element(index), index, latestReadID);
    //     virtualizer.scrollToIndex(index);
    // }

    window.requestIdleCallback(
      async () => {
        // setup intersection observer
        const loadMore = this.shadowRoot?.querySelector('#load-more') as any;
        const scrollContainer = this.shadowRoot?.querySelector(
          '#mainList'
        ) as HTMLElement;

        if (!loadMore || !scrollContainer) {
          console.warn('Load more button or scroll container not found');
          return;
        }

        // Track scroll position for caching
        let scrollTimeout: number;
        scrollContainer.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = window.setTimeout(() => {
            this.lastScrollPosition = scrollContainer.scrollTop;
            updateCacheScrollPosition(
              this.timelineType,
              this.lastScrollPosition
            );
          }, 150);
        });

        const observer = new IntersectionObserver(
          async (entries: Array<IntersectionObserverEntry>) => {
            entries.forEach(async (entry: IntersectionObserverEntry) => {
              if (entry.isIntersecting) {
                if (this.loadingData) return;

                this.loadingData = true;
                await this.loadMore();
                this.loadingData = false;
              }
            });
          },
          {
            root: scrollContainer,
            rootMargin: '100px',
            threshold: 0.1,
          }
        );

        observer.observe(loadMore);
      },
      { timeout: 3000 }
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    // Save timeline to cache when navigating away
    if (this.timeline.length > 0) {
      console.log('Saving timeline to cache on disconnect');
      saveTimelineCache(
        this.timelineType,
        this.timeline,
        this.lastScrollPosition
      );
    }
  }

  public async refreshTimeline(skipCache: boolean = true) {
    console.log('refreshing timeline', this.timelineType);

    // Save current timeline data before refreshing
    if (!skipCache && this.timeline.length > 0) {
      saveTimelineCache(
        this.timelineType,
        this.timeline,
        this.lastScrollPosition
      );
    }

    switch (this.timelineType) {
      case 'for you': {
        const timelineDataMix = await mixTimeline('home');
        console.log('timelineData', timelineDataMix);

        this.timeline = [];
        await this.hasUpdated;

        // Deduplicate by post ID
        const uniqueMix = Array.from(
          new Map(timelineDataMix.map((post: Post) => [post.id, post])).values()
        ) as Post[];
        this.timeline = uniqueMix;

        // Save to cache after successful fetch
        saveTimelineCache(this.timelineType, this.timeline, 0);

        this.requestUpdate();
        break;
      }
      case 'home and some trending': {
        const timelineDataMix2 = await mixTimeline('home');
        console.log('timelineData', timelineDataMix2);

        this.timeline = [];
        await this.hasUpdated;

        // Deduplicate by post ID
        const uniqueMix2 = Array.from(
          new Map(
            timelineDataMix2.map((post: Post) => [post.id, post])
          ).values()
        ) as Post[];
        this.timeline = uniqueMix2;

        // Save to cache after successful fetch
        saveTimelineCache(this.timelineType, this.timeline, 0);

        this.requestUpdate();
        break;
      }
      case 'home': {
        const last_read_id = sessionStorage.getItem('latest-read');
        if (last_read_id) {
          const timelineData = await getLastPlaceTimeline();

          this.timeline = [];
          await this.hasUpdated;

          if (timelineData) {
            // Deduplicate by post ID
            const uniqueLastPlace = Array.from(
              new Map(
                timelineData.map((post: Post) => [post.id, post])
              ).values()
            ) as Post[];
            this.timeline = uniqueLastPlace;
          }

          // Save to cache after successful fetch
          saveTimelineCache(this.timelineType, this.timeline, 0);

          this.requestUpdate();
          break;
        }

        console.log('LOOK HERE');
        const timelineData = await getPaginatedHomeTimeline('home');
        console.log('timelineData', timelineData);

        this.timeline = [];
        await this.hasUpdated;

        // Deduplicate by post ID
        const uniqueHome = Array.from(
          new Map(timelineData.map((post: Post) => [post.id, post])).values()
        ) as Post[];
        this.timeline = uniqueHome;

        // Save to cache after successful fetch
        saveTimelineCache(this.timelineType, this.timeline, 0);

        this.requestUpdate();
        break;
      }
      case 'public': {
        const timelineDataPub = await getPreviewTimeline();
        console.log(timelineDataPub);

        this.timeline = [];
        await this.hasUpdated;

        // Deduplicate by post ID
        const uniquePub = Array.from(
          new Map(timelineDataPub.map((post: Post) => [post.id, post])).values()
        ) as Post[];
        this.timeline = uniquePub;

        // Save to cache after successful fetch
        saveTimelineCache(this.timelineType, this.timeline, 0);

        this.requestUpdate();
        break;
      }
      case 'media': {
        console.log('media timeline');
        const timelineDataMedia = await getPaginatedHomeTimeline('home');

        // filter out tweets that don't have media
        const mediaFiltered = (timelineDataMedia as Array<Post>).filter(
          (tweet: Post) => tweet.media_attachments.length > 0
        );
        console.log(mediaFiltered);

        // Deduplicate by post ID
        const uniqueMedia = Array.from(
          new Map(mediaFiltered.map((post: Post) => [post.id, post])).values()
        ) as Post[];
        this.timeline = uniqueMedia;

        // Save to cache after successful fetch
        saveTimelineCache(this.timelineType, this.timeline, 0);

        this.requestUpdate();
        break;
      }

      default:
        break;
    }
  }

  async loadMore() {
    const timelineData: Post[] = await getPaginatedHomeTimeline(
      this.timelineType ? this.timelineType : 'home'
    );
    console.log(timelineData);

    // Deduplicate posts by ID to prevent showing duplicates
    const existingIds = new Set(this.timeline.map((post) => post.id));
    const newPosts = timelineData.filter((post) => !existingIds.has(post.id));

    this.timeline = [...this.timeline, ...newPosts];

    // Update cache with new data
    saveTimelineCache(
      this.timelineType,
      this.timeline,
      this.lastScrollPosition
    );
  }

  handleReplies(data: Array<Post>) {
    console.log('reply', data);

    // fire custom event
    this.dispatchEvent(
      new CustomEvent('replies', {
        detail: {
          data,
        },
      })
    );
  }

  async showImage(imageURL: string) {
    console.log('show image', imageURL);
    // this.imgPreview = imageURL;

    // const dialog = this.shadowRoot?.querySelector('#img-preview') as any;
    // await dialog.show();

    if ('startViewTransition' in document) {
      await document.startViewTransition();
      router.navigate(`/home/img-preview?src=${imageURL}`);
    } else {
      router.navigate(`/home/img-preview?src=${imageURL}`);
    }
  }

  async showAnalyze(data: any, imageData: any, tweet: any) {
    this.analyzeData = null;
    this.imageDesc = undefined;
    this.analyzeTweet = null;

    if (
      data.results &&
      data.results?.documents[0] &&
      data.results.documents[0].entities &&
      data.results.documents[0].entities?.length !== 0
    ) {
      this.analyzeData = data.results.documents[0].entities;
    }

    if (imageData) {
      this.imageDesc = imageData.descriptionResult.values[0].text;
    }

    this.analyzeTweet = tweet;

    const dialog = this.shadowRoot?.querySelector('#analyze') as any;
    await dialog.show();
  }

  async changeTimelineType(
    type: 'home' | 'public' | 'media' | 'for you' | 'home and some trending'
  ) {
    this.timelineType = type;

    await this.refreshTimeline();

    this.requestUpdate();

    const { set } = await import('idb-keyval');

    await set('timelineType', type);
  }

  handleSummary($event: any) {
    // keep passing it up
    this.dispatchEvent(
      new CustomEvent('handle-summary', {
        detail: {
          data: $event.detail.data,
        },
      })
    );
  }

  handleTranslating($event: any) {
    // keep passing it up
    this.dispatchEvent(
      new CustomEvent('handle-translating', {
        detail: {
          tweet: $event.detail.tweet,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleOpen(tweet: any) {
    this.dispatchEvent(
      new CustomEvent('open', {
        detail: {
          tweet,
        },
      })
    );
  }

  render() {
    return html`
      <md-dialog
        id="img-preview"
        .open=${!!this.imgPreview}
        label="Image Preview"
      >
        ${this.imgPreview
        ? html`<img
              src="${this.imgPreview}"
              style="width:100%;border-radius:6px;"
            />`
        : null}
      </md-dialog>

      <div id="timeline-header">
        <md-select
          pill
          .value="${this.timelineType}"
          @change="${($event: any) =>
        this.changeTimelineType($event.detail.value)}"
          placeholder="home"
        >
          <md-option value="for you">for you</md-option>
          <md-option value="home and some trending"
            >home and some trending</md-option
          >
          <md-option value="home">home</md-option>
          <md-option value="public">public</md-option>
        </md-select>

        <md-icon-button
          id="refresh-manual-button"
          circle
          @click="${() => {
        clearTimelineCache(this.timelineType);
        this.refreshTimeline(true);
      }}"
        >
          <md-icon src="/assets/refresh-circle-outline.svg"></md-icon>
        </md-icon-button>
      </div>

      <ul id="mainList" part="list" class="scrollbar-hidden">
        <div id="refresh-indicator">
          <md-icon src="/assets/refresh-circle-outline.svg"></md-icon>
        </div>

        ${this.loadingData && this.timeline.length === 0
        ? html`<md-skeleton-card count="5"></md-skeleton-card>`
        : html`
              <lit-virtualizer
                .items=${this.timeline as any}
                .renderItem=${(tweet: any) =>
            html`<li class="timeline-list-item">
                    <timeline-item
                      @open="${($event: CustomEvent) =>
                this.handleOpen($event.detail.tweet)}"
                      @summarize="${($event: any) =>
                this.handleSummary($event)}"
                      @translating="${($event: any) =>
                this.handleTranslating($event)}"
                      tweetID="${tweet.id}"
                      @delete="${() => this.refreshTimeline()}"
                      @analyze="${($event: any) =>
                this.showAnalyze(
                  $event.detail.data,
                  $event.detail.imageData,
                  $event.detail.tweet
                )}"
                      @openimage="${($event: any) =>
                this.showImage($event.detail.imageURL)}"
                      ?show="${true}"
                      @replies="${($event: any) =>
                this.handleReplies($event.detail.data)}"
                      .tweet="${tweet}"
                    ></timeline-item>
                  </li>`}
              >
              </lit-virtualizer>

              <md-button
                variant="text"
                ?disabled="${this.loadingData}"
                id="load-more"
              >
                ${this.loadingData ? 'Loading...' : 'Load More'}
              </md-button>
            `}
      </ul>
    `;
  }
}
