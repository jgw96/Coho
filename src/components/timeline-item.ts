import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '../components/user-profile';

import '../components/md-card';
import '../components/md-icon';
import '../components/md-icon-button';

import '../components/image-carousel';

import { getSettings } from '../services/settings';

// import * as blurhash from "blurhash-wasm";

import '../components/md-button';

// @ts-ignore
import ImgWorker from '../utils/img-worker?worker';
import { router } from '../utils/router';
import { Post } from '../interfaces/Post';
// import { enableVibrate } from '../utils/handle-vibrate';

@customElement('timeline-item')
export class TimelineItem extends LitElement {
  @property({ type: Object }) tweet: Post | undefined;
  @property({ type: Boolean }) show: boolean = false;
  @property({ type: Boolean }) showreply: boolean = false;

  @state() isBoosted: boolean = false;
  @state() isReblogged: boolean = false;
  @state() isBookmarked: boolean = false;
  @state() threadExpanded: boolean = false;
  @state() threadPosts: Post[] = [];
  @state() loadingThread: boolean = false;

  @state() settings: any | undefined;

  @state() currentUser: any;

  worker: Worker | undefined;

  device: 'mobile' | 'desktop' = 'mobile';

  static styles = [
    css`
      :host {
        display: block;

        width: 100%;

        margin-bottom: 10px;
      }

      md-card {
        content-visibility: auto;

        animation-name: slideUp;
        animation-duration: 0.3s;
        animation-fill-mode: forwards;

        border-bottom: solid 1px;
        border-color: #6767679e;
      }

      .boosted-by {
        flex: 2;
      }

      .boosted-by span {
        font-size: 12px;

        margin-bottom: 6px;
        display: block;
      }

      .sensitive {
        background: rgb(32 32 35);
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-radius: 6px;
        padding-top: 8px;
        padding-bottom: 8px;
      }

      .sensitive span {
        font-weight: bold;
        display: block;
        width: 136px;
      }

      .sensitive p {
        text-align: center;
      }

      .link-card {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 10px;

        background: #ffffff0d;
        border-radius: 6px;

        overflow: hidden;
      }

      .link-card h4 {
        margin-bottom: 0;
        margin-top: 0;
      }

      .link-card img {
        min-height: 140px;
        border-radius: 6px;
        width: 100%;
        object-fit: cover;
      }

      .link-card-content {
        width: -webkit-fill-available;
        padding-left: 12px;
        padding-right: 12px;
      }

      .link-card-content p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (prefers-color-scheme: light) {
        .sensitive {
          background: white;
        }
      }

      .header-actions-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-actions-block div {
        display: flex;
        align-items: center;
      }

      .header-actions-block span {
        color: #878792;
        font-size: 14px;
      }

      img[data-src] {
        opacity: 0;
      }

      img {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;

        contain: content;
      }

      .status-link-card {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 10px;
        background: rgb(255 255 255 / 11%);
        border-radius: 6px;
        padding: 10px;
      }

      .status-link-card a {
        display: flex;
        align-items: center;
        justify-content: space-around;
        gap: 10px;
      }

      .status-link-card img {
        width: 100%;
        max-width: 300px;
        border-radius: 6px;
        height: initial;
      }

      .status-link-card__content p {
        margin-top: 6px;

        white-space: nowrap;
        max-width: 40vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .status-link-card__title {
        padding: 0;
        margin: 0;
      }

      md-card {
        width: 100%;
        overflow-x: hidden;
        content-visibility: auto;
      }

      md-card a {
        color: var(--sl-color-secondary-700);
      }

      md-card::part(body) {
        padding-top: 0;
      }

      md-card img {
        object-fit: cover;
        border-radius: 6px 6px 0px 0px;
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
        gap: 6px;
      }

      .actions md-button {
        background: transparent;
        border: none;
        font-size: 1.2em;
        color: grey;
      }

      img {
        background: #ffffff4f;
      }

      @media (prefers-color-scheme: dark) {
        img {
          background: rgb(24 25 31);
        }
      }

      md-card::part(footer) {
        border-top: none;
      }

      .replyCard {
        margin-left: 15px;
        width: 96%;
      }

      #reply-to {
        height: 33px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: var(--primary-color);
        margin-top: 6px;

        font-size: 14px;
        gap: 8px;
      }

      .thread-continuation {
        margin-left: 16px;
        padding-left: 20px;
        border-left: 3px solid var(--sl-color-primary-600);
        margin-top: 8px;
      }

      .thread-continuation md-card {
        margin-bottom: 8px;
      }

      .thread-line {
        width: 3px;
        background: var(--sl-color-primary-600);
        margin-left: 8px;
        height: 16px;
      }

            @media (max-width: 820px) {
        .timeline-item {
          border-radius: 0;

      @media (prefers-color-scheme: light) {
        #reply-to {
          color: black;
        }
      }

      @keyframes slideUp {
        0% {
          transform: translateY(30px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ];

  async showThread() {
    if (!this.tweet?.in_reply_to_id) return;

    this.loadingThread = true;
    try {
      const { getReplies } = await import('../services/timeline');
      const context = await getReplies(this.tweet.id);

      // Combine ancestors and descendants, removing the current post
      const ancestors = context.ancestors || [];
      const descendants = context.descendants || [];
      this.threadPosts = [...ancestors, ...descendants];
      this.threadExpanded = true;
    } catch (error) {
      console.error('Failed to load thread:', error);
    } finally {
      this.loadingThread = false;
    }
  }

  async firstUpdated() {
    this.settings = await getSettings();
  }

  async favorite(id: string) {
    console.log('favorite', id);

    this.isBoosted = true;

    // Update tweet state
    if (this.tweet) {
      this.tweet.favourited = true;
      if (this.tweet.reblog) {
        this.tweet.reblog.favourites_count++;
      } else {
        this.tweet.favourites_count++;
      }
    }

    const { boostPost } = await import('../services/timeline');
    await boostPost(id);

    // fire custom event
    this.dispatchEvent(
      new CustomEvent('favorite', {
        detail: {
          id,
        },
      })
    );

    this.requestUpdate();
  }

  async reblog(id: string) {
    console.log('reblog', id);

    this.isReblogged = true;

    // Update tweet state
    if (this.tweet) {
      this.tweet.reblogged = true;
      if (this.tweet.reblog) {
        this.tweet.reblog.reblogs_count++;
      } else {
        this.tweet.reblogs_count++;
      }
    }

    const { reblogPost } = await import('../services/timeline');
    await reblogPost(id);

    // fire custom event
    this.dispatchEvent(
      new CustomEvent('reblog', {
        detail: {
          id,
        },
      })
    );

    this.requestUpdate();
  }

  async bookmark(id: string) {
    console.log('bookmark', id);

    this.isBookmarked = true;

    // Update tweet state
    if (this.tweet) {
      this.tweet.bookmarked = true;
    }

    const { addBookmark } = await import('../services/bookmarks');
    await addBookmark(id);

    this.requestUpdate();
  }

  async replies() {
    await this.openPost();
  }

  async openInBox(imageURL: string) {
    console.log('show image', imageURL);

    if ('startViewTransition' in document) {
      // @ts-ignore
      this.style.viewTransitionName = 'image-preview';

      //@ts-ignore
      await document.startViewTransition();
      router.navigate(`/imagepreview?src=${imageURL}`);

      setTimeout(() => {
        // @ts-ignore
        this.style.viewTransitionName = '';
      }, 800);
    } else {
      router.navigate(`/imagepreview?src=${imageURL}`);
    }
  }

  // async analyzeStatus(tweet: Post | null) {
  //     if (tweet) {
  //         const { analyzeStatusText, analyzeStatusImage } = await import('../services/ai');
  //         const data = await analyzeStatusText(tweet.reblog ? tweet.reblog.content : tweet.content);

  //         let imageData: string | null = null;
  //         const imageURL = tweet.reblog ? tweet.reblog.media_attachments[0] ? tweet.reblog.media_attachments[0].preview_url : null : tweet.media_attachments[0] ? tweet.media_attachments[0]?.preview_url : null;

  //         if (imageURL) {
  //             imageData = await analyzeStatusImage(imageURL);
  //         }

  //         if (data) {
  //             console.log(data);

  //             this.dispatchEvent(new CustomEvent('analyze', {
  //                 detail: {
  //                     data,
  //                     imageData: imageData ? imageData : null,
  //                     tweet
  //                 }
  //             }));
  //         }
  //     }

  // }

  async shareStatus(tweet: Post | null) {
    if (tweet) {
      // share status with web share api
      if (navigator.share) {
        await navigator.share({
          title: 'Coho',
          text: tweet.reblog ? tweet.reblog.content : tweet.content,
          url: `https://mastodon.social/web/statuses/${tweet.reblog ? tweet.reblog.id : tweet.id}`,
        });
      } else {
        // fallback to clipboard api
        const url = `https://mastodon.social/web/statuses/${tweet.reblog ? tweet.reblog.id : tweet.id}`;
        await navigator.clipboard.writeText(url);
      }
    }
  }

  async openPost() {
    if (this.device === 'mobile') {
      // @ts-ignore
      if ('startViewTransition' in document) {
        // @ts-ignore
        this.style.viewTransitionName = 'card';

        // @ts-ignore
        // document.startViewTransition(async () => {
        //     if (this.tweet) {
        //         const serialized = new URLSearchParams(JSON.stringify(this.tweet)).toString();

        //         await router.navigate(`/home/post?${serialized}`);

        //         setTimeout(() => {
        //             // @ts-ignore
        //             this.style.viewTransitionName = '';
        //         }, 800)
        //     }
        // });
        await document.startViewTransition();

        if (this.tweet) {
          const serialized = new URLSearchParams(
            JSON.stringify(this.tweet)
          ).toString();

          await router.navigate(`/home/post?${serialized}`);

          setTimeout(() => {
            // @ts-ignore
            this.style.viewTransitionName = '';
          }, 800);
        }
      } else {
        const serialized = new URLSearchParams(
          JSON.stringify(this.tweet)
        ).toString();

        await router.navigate(`/home/post?${serialized}`);
      }
    } else {
      // emit custom event with post
      this.dispatchEvent(
        new CustomEvent('open', {
          detail: {
            tweet: this.tweet,
          },
        })
      );
    }
  }

  async deleteStatus() {
    if (this.tweet) {
      const { deletePost } = await import('../services/posts');
      await deletePost(this.tweet.id);

      this.dispatchEvent(
        new CustomEvent('delete', {
          detail: {
            id: this.tweet.id,
          },
        })
      );
    }
  }

  async initEditStatus() {
    this.dispatchEvent(
      new CustomEvent('edit', {
        detail: {
          tweet: this.tweet,
        },
      })
    );
  }

  viewSensitive() {
    if (this.tweet) {
      this.tweet.sensitive = false;
      this.requestUpdate();
    }
  }

  openLinkCard(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  async summarizePost(postContent: string | null) {
    if (!postContent) return;

    // remove all html tags
    const text = postContent.replace(/(<([^>]+)>)/gi, '');

    const { summarize } = await import('../services/ai');
    const summaryData = await summarize(text);

    if (summaryData) {
      console.log(summaryData);

      this.dispatchEvent(
        new CustomEvent('summarize', {
          detail: {
            data: summaryData.choices[0].message.content,
            tweet: this.tweet,
          },
        })
      );
    }
  }

  async translatePost(postContent: string | null) {
    if (!postContent) return;

    this.dispatchEvent(
      new CustomEvent('translating', {
        detail: {
          tweet: this.tweet,
        },
        bubbles: true,
        composed: true,
      })
    );

    // remove all html tags
    const text = postContent.replace(/(<([^>]+)>)/gi, '');

    const { translate } = await import('../services/ai');
    const translateData = await translate(text);

    if (translateData) {
      console.log(translateData);

      this.dispatchEvent(
        new CustomEvent('summarize', {
          detail: {
            data: translateData,
            tweet: this.tweet,
          },
        })
      );
    }
  }

  render() {
    return html`
      ${this.tweet && this.tweet.sensitive === true
        ? html`
            <div class="sensitive">
              <span>Sensitive Content</span>
              <p>${this.tweet.spoiler_text || 'No spoiler text provided'}</p>

              <md-button
                variant="text"
                pill
                @click="${() => this.viewSensitive()}"
              >
                View
                <md-icon slot="suffix" name="eye"></md-icon>
              </md-button>
            </div>
          `
        : html`
            ${this.tweet?.reblog === null || this.tweet?.reblog === undefined
            ? html`
                  ${this.tweet?.reply_to !== null &&
                this.tweet?.reply_to !== undefined &&
                this.show === true
                ? html`
                        <div id="reply-to">
                          <md-icon name="chatbox"></md-icon>
                          Thread
                        </div>

                        <md-card part="card">
                          <user-profile
                            .account="${this.tweet?.reply_to.account}"
                          ></user-profile>
                          <div
                            .innerHTML="${this.tweet?.reply_to.content}"
                          ></div>

                          <div class="actions" slot="footer">
                            ${this.show === true
                    ? html`<md-button
                                  variant="text"
                                  pill
                                  @click="${() => this.replies()}"
                                >
                                  <md-icon
                                    slot="suffix"
                                    name="chatbox"
                                  ></md-icon>
                                </md-button>`
                    : null}

                            <md-button
                              variant="text"
                              ?disabled=${this.isBookmarked ||
                  this.tweet?.reply_to.bookmarked}
                              pill
                              @click="${() =>
                    this.bookmark(this.tweet?.reply_to.id || '')}"
                              ><md-icon slot="suffix" name="bookmark"></md-icon
                            ></md-button>
                            ${this.settings && this.settings.wellness === false
                    ? html`<md-button
                                  variant="text"
                                  ?disabled=${this.isBoosted ||
                      this.tweet?.reply_to.favourited}
                                  pill
                                  @click="${() =>
                        this.favorite(
                          this.tweet?.reply_to.id || ''
                        )}"
                                  >${this.tweet?.reply_to.favourites_count}
                                  <md-icon slot="suffix" name="heart"></md-icon
                                ></md-button>`
                    : null}
                            ${this.settings && this.settings.wellness === false
                    ? html`<md-button
                                  variant="text"
                                  ?disabled=${this.isReblogged ||
                      this.tweet?.reply_to.reblogged}
                                  pill
                                  @click="${() =>
                        this.reblog(this.tweet?.reply_to.id || '')}"
                                  >${this.tweet?.reply_to.reblogs_count}
                                  <md-icon slot="suffix" name="repeat"></md-icon
                                ></md-button>`
                    : null}
                          </div>
                        </md-card>
                      `
                : null}

                  <md-card
                    part="card"
                    class="${classMap({
                  replyCard: this.tweet?.reply_to ? true : false,
                })}"
                  >
                    ${this.tweet && this.tweet.media_attachments.length > 0
                ? html`
                          <image-carousel
                            .images="${this.tweet.media_attachments}"
                            slot="image"
                          >
                          </image-carousel>
                        `
                : html``}

                    <div class="header-actions-block" slot="header">
                      <div>
                        <md-button
                          pill
                          variant="outlined"
                          size="small"
                          @click="${() =>
                this.translatePost(this.tweet?.content || null)}"
                          pill
                          >Translate</md-button
                        >

                        <md-icon-button
                          @click="${() => this.shareStatus(this.tweet || null)}"
                          name="share"
                          label="Share"
                        >
                        </md-icon-button>

                        ${this.tweet?.account.acct === this.currentUser?.acct
                ? html`
                              <md-icon-button
                                @click="${() => this.deleteStatus()}"
                                name="trash"
                                label="Delete"
                              >
                              </md-icon-button>

                              <md-icon-button
                                @click="${() => this.initEditStatus()}"
                                name="brush"
                                label="Edit"
                              >
                              </md-icon-button>
                            `
                : null}
                      </div>

                      <span>
                        ${new Intl.RelativeTimeFormat('en', {
                  numeric: 'auto',
                }).format(
                  Math.floor(
                    -(
                      (new Date() as any) -
                      (new Date(this.tweet?.created_at || '') as any)
                    ) /
                    1000 /
                    60
                  ),
                  'minutes'
                )}
                      </span>
                    </div>

                    <user-profile
                      .account="${this.tweet?.account}"
                    ></user-profile>

                    ${this.tweet?.in_reply_to_id && !this.threadExpanded
                ? html`
                          <md-button
                            variant="text"
                            size="small"
                            ?disabled=${this.loadingThread}
                            @click=${this.showThread}
                            style="margin-bottom: 8px; padding: 4px 8px;"
                          >
                            <md-icon
                              slot="prefix"
                              name="chatbox"
                              style="width: 14px; height: 14px;"
                            ></md-icon>
                            ${this.loadingThread
                    ? 'Loading thread...'
                    : 'Show this thread'}
                          </md-button>
                        `
                : null}

                    <div
                      @click="${this.openPost}"
                      .innerHTML="${this.tweet?.content || ''}"
                    ></div>

                    ${this.tweet && this.tweet.card
                ? html`
                          <div
                            @click="${() =>
                    this.openLinkCard(this.tweet?.card?.url || '')}"
                            class="link-card"
                          >
                            <img
                              src="${this.tweet.card.image ||
                  '/assets/bookmark-outline.svg'}"
                              alt="${this.tweet.card.title}"
                            />

                            <div class="link-card-content">
                              <h4>${this.tweet.card.title}</h4>
                              <p>${this.tweet.card.description}</p>
                            </div>
                          </div>
                        `
                : null}

                    <div class="actions" slot="footer">
                      ${this.show === true
                ? html`<md-button
                            variant="text"
                            pill
                            @click="${() => this.replies()}"
                          >
                            <md-icon
                              slot="suffix"
                              src="/assets/chatbox-outline.svg"
                            ></md-icon>
                          </md-button>`
                : null}
                      <md-button
                        variant="text"
                        ?disabled=${this.isBookmarked || this.tweet?.bookmarked}
                        pill
                        @click="${() => this.bookmark(this.tweet?.id || '')}"
                        ><md-icon
                          slot="suffix"
                          src="/assets/bookmark-outline.svg"
                        ></md-icon
                      ></md-button>
                      ${this.settings && this.settings.wellness === false
                ? html`<md-button
                            variant="text"
                            ?disabled=${this.isBoosted ||
                  this.tweet?.favourited}
                            pill
                            @click="${() =>
                    this.favorite(this.tweet?.id || '')}"
                            >${this.tweet?.favourites_count}
                            <md-icon slot="suffix" name="heart"></md-icon
                          ></md-button>`
                : null}
                      ${this.settings && this.settings.wellness === false
                ? html`<md-button
                            variant="text"
                            ?disabled=${this.isReblogged ||
                  this.tweet?.reblogged}
                            pill
                            @click="${() => this.reblog(this.tweet?.id || '')}"
                            >${this.tweet?.reblogs_count}
                            <md-icon slot="suffix" name="repeat"></md-icon
                          ></md-button>`
                : null}
                    </div>
                  </md-card>
                `
            : html`
                  <md-card slot="card">
                    ${this.tweet.reblog &&
                this.tweet.reblog.media_attachments.length > 0
                ? html`
                          <image-carousel
                            .images="${this.tweet.reblog.media_attachments}"
                            slot="image"
                          >
                          </image-carousel>
                        `
                : html``}

                    <div class="header-block reblog-header" slot="header">
                      <user-profile
                        ?small="${true}"
                        .account="${this.tweet?.reblog.account}"
                      ></user-profile>

                      <div class="boosted-by">
                        <span>Boosted by</span>
                        <user-profile
                          boosted
                          class="smaller-profile"
                          ?small="${true}"
                          .account="${this.tweet?.account}"
                        ></user-profile>
                      </div>
                      <md-icon-button
                        @click="${() => this.shareStatus(this.tweet || null)}"
                        name="share"
                        label="Share"
                      >
                      </md-icon-button>
                    </div>
                    <h5>${this.tweet?.reblog.account.acct} posted</h5>

                    <div
                      @click="${() => this.openPost()}"
                      .innerHTML="${this.tweet?.reblog.content}"
                    ></div>

                    <div class="actions" slot="footer">
                      ${this.show === true
                ? html`<md-button
                            variant="text"
                            pill
                            @click="${() => this.replies()}"
                          >
                            <md-icon slot="suffix" name="chatbox"></md-icon>
                          </md-button>`
                : null}
                      <md-button
                        variant="text"
                        ?disabled=${this.isBookmarked}
                        pill
                        @click="${() => this.bookmark(this.tweet?.id || '')}"
                        ><md-icon slot="suffix" name="bookmark"></md-icon
                      ></md-button>
                      ${this.settings && this.settings.wellness === false
                ? html`<md-button
                            variant="text"
                            ?disabled=${this.isBoosted ||
                  this.tweet?.favourited}
                            pill
                            @click="${() =>
                    this.favorite(this.tweet?.id || '')}"
                            >${this.tweet?.reblog.favourites_count}
                            <md-icon slot="suffix" name="heart"></md-icon
                          ></md-button>`
                : null}
                      ${this.settings && this.settings.wellness === false
                ? html`<md-button
                            variant="text"
                            ?disabled=${this.isReblogged ||
                  this.tweet?.reblogged}
                            pill
                            @click="${() => this.reblog(this.tweet?.id || '')}"
                            >${this.tweet?.reblog.reblogs_count}
                            <md-icon slot="suffix" name="repeat"></md-icon
                          ></md-button>`
                : null}
                    </div>
                  </md-card>
                `}
            ${this.threadExpanded && this.threadPosts.length > 0
            ? html`
                  <div class="thread-line"></div>
                  <div class="thread-continuation">
                    ${this.threadPosts.map(
              (threadPost: Post) => html`
                        <md-card>
                          <div class="header-block" slot="header">
                            <user-profile
                              ?small="${true}"
                              .account="${threadPost.account}"
                            ></user-profile>
                          </div>
                          <div .innerHTML="${threadPost.content}"></div>
                          <div class="actions" slot="footer">
                            <md-button
                              variant="text"
                              ?disabled=${threadPost.bookmarked}
                              pill
                              @click="${() => this.bookmark(threadPost.id)}"
                              ><md-icon slot="suffix" name="bookmark"></md-icon
                            ></md-button>
                            ${this.settings && this.settings.wellness === false
                  ? html`<md-button
                                  variant="text"
                                  ?disabled=${threadPost.favourited}
                                  pill
                                  @click="${() => this.favorite(threadPost.id)}"
                                  >${threadPost.favourites_count}
                                  <md-icon slot="suffix" name="heart"></md-icon
                                ></md-button>`
                  : null}
                            ${this.settings && this.settings.wellness === false
                  ? html`<md-button
                                  variant="text"
                                  ?disabled=${threadPost.reblogged}
                                  pill
                                  @click="${() => this.reblog(threadPost.id)}"
                                  >${threadPost.reblogs_count}
                                  <md-icon slot="suffix" name="repeat"></md-icon
                                ></md-button>`
                  : null}
                          </div>
                        </md-card>
                      `
            )}
                  </div>
                `
            : null}
          `}
    `;
  }
}
