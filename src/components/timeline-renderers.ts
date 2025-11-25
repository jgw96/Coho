import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { Post } from '../interfaces/Post';

import '../components/user-profile';
import '../components/md-card';
import '../components/md-icon';
import '../components/md-icon-button';
import '../components/image-carousel';
import '../components/md-button';

export interface TimelineItemHandlers {
  viewSensitive: () => void;
  replies: () => void;
  bookmark: (id: string) => void;
  favorite: (id: string) => void;
  reblog: (id: string) => void;
  translatePost: (content: string | null) => void;
  shareStatus: (tweet: Post | null) => void;
  deleteStatus: () => void;
  initEditStatus: () => void;
  openPost: () => void;
  openLinkCard: (url: string) => void;
  showThread: () => void;
}

export interface TimelineItemState {
  tweet: Post | undefined;
  show: boolean;
  currentUser: any;
  settings: any;
  isBookmarked: boolean;
  isBoosted: boolean;
  isReblogged: boolean;
  loadingThread: boolean;
  threadExpanded: boolean;
  threadPosts: Post[];
}

export function renderSensitive(
  state: TimelineItemState,
  handlers: TimelineItemHandlers
) {
  return html`
    <div class="sensitive">
      <span>Sensitive Content</span>
      <p>${state.tweet?.spoiler_text || 'No spoiler text provided'}</p>

      <md-button variant="text" pill @click="${() => handlers.viewSensitive()}">
        View
        <md-icon slot="suffix" name="eye"></md-icon>
      </md-button>
    </div>
  `;
}

export function renderReplyContext(
  state: TimelineItemState,
  handlers: TimelineItemHandlers
) {
  if (!state.tweet?.reply_to || !state.show) return null;

  return html`
    <div id="reply-to">
      <md-icon name="chatbox"></md-icon>
      Thread
    </div>

    <md-card part="card">
      <user-profile .account="${state.tweet?.reply_to.account}"></user-profile>
      <div .innerHTML="${state.tweet?.reply_to.content}"></div>

      <div class="actions" slot="footer">
        ${state.show === true
      ? html`<md-button
              variant="text"
              pill
              size="small"
              style="--md-sys-color-primary: #878792"
              @click="${() => handlers.replies()}"
            >
              <md-icon slot="suffix" name="chatbox"></md-icon>
            </md-button>`
      : null}

        <md-button
          variant="text"
          style="--md-sys-color-primary: ${state.isBookmarked ||
      state.tweet?.reply_to.bookmarked
      ? 'var(--sl-color-primary-600)'
      : '#878792'}"
          pill
          size="small"
          @click="${() => handlers.bookmark(state.tweet?.reply_to.id || '')}"
          ><md-icon slot="suffix" name="bookmark"></md-icon
        ></md-button>
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isBoosted ||
          state.tweet?.reply_to.favourited
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              size="small"
              @click="${() =>
          handlers.favorite(state.tweet?.reply_to.id || '')}"
              >${state.tweet?.reply_to.favourites_count}
              <md-icon slot="suffix" name="heart"></md-icon
            ></md-button>`
      : null}
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isReblogged ||
          state.tweet?.reply_to.reblogged
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              @click="${() => handlers.reblog(state.tweet?.reply_to.id || '')}"
              >${state.tweet?.reply_to.reblogs_count}
              <md-icon slot="suffix" name="repeat"></md-icon
            ></md-button>`
      : null}
      </div>
    </md-card>
  `;
}

export function renderRegularTweet(
  state: TimelineItemState,
  handlers: TimelineItemHandlers
) {
  return html`
    ${renderReplyContext(state, handlers)}

    <md-card
      part="card"
      class="${classMap({
    replyCard: state.tweet?.reply_to ? true : false,
  })}"
    >
      <div class="header-actions-block" slot="header">
        <user-profile .account="${state.tweet?.account}"></user-profile>

        <div class="actions-right">
          <md-icon-button
            size="small"
            @click="${() =>
      handlers.translatePost(state.tweet?.content || null)}"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ionicon"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
                d="M48 112h288M192 64v48M272 448l96-224 96 224M301.5 384h133M281.3 112S257 206 199 277 80 384 80 384"
              />
              <path
                d="M256 336s-35-27-72-75-56-85-56-85"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="32"
              />
            </svg>
          </md-icon-button>

          <md-icon-button
            @click="${() => handlers.shareStatus(state.tweet || null)}"
            name="share"
            label="Share"
            size="small"
          >
          </md-icon-button>

          ${state.tweet?.account.acct === state.currentUser?.acct
      ? html`
                <md-icon-button
                  @click="${() => handlers.deleteStatus()}"
                  name="trash"
                  label="Delete"
                >
                </md-icon-button>

                <md-icon-button
                  @click="${() => handlers.initEditStatus()}"
                  name="brush"
                  label="Edit"
                >
                </md-icon-button>
              `
      : null}
        </div>

        : null}
        </div>
      </div>

      <div
        @click="${handlers.openPost}"
        .innerHTML="${state.tweet?.content || ''}"
      ></div>

      ${state.tweet && state.tweet.media_attachments.length > 0
      ? html`
            <image-carousel .images="${state.tweet.media_attachments}">
            </image-carousel>
          `
      : html``}
      ${state.tweet && state.tweet.card
      ? html`
            <div
              @click="${() =>
          handlers.openLinkCard(state.tweet?.card?.url || '')}"
              class="link-card"
            >
              <img
                src="${state.tweet.card.image ||
        '/assets/bookmark-outline.svg'}"
                alt="${state.tweet.card.title}"
              />

              <div class="link-card-content">
                <h4>${state.tweet.card.title}</h4>
                <p>${state.tweet.card.description}</p>
              </div>
            </div>
          `
      : null}

      <div class="actions" slot="footer">
        ${state.show === true
      ? html`<md-button
              variant="text"
              pill
              size="small"
              style="--md-sys-color-primary: #878792"
              @click="${() => handlers.replies()}"
            >
              <md-icon
                slot="suffix"
                src="/assets/chatbox-outline.svg"
              ></md-icon>
            </md-button>`
      : null}
        <md-button
          variant="text"
          style="--md-sys-color-primary: ${state.isBookmarked ||
      state.tweet?.bookmarked
      ? 'var(--sl-color-primary-600)'
      : '#878792'}"
          pill
          size="small"
          @click="${() => handlers.bookmark(state.tweet?.id || '')}"
          ><md-icon slot="suffix" src="/assets/bookmark-outline.svg"></md-icon
        ></md-button>
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isBoosted ||
          state.tweet?.favourited
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              size="small"
              @click="${() => handlers.favorite(state.tweet?.id || '')}"
              >${state.tweet?.favourites_count}
              <md-icon slot="suffix" name="heart"></md-icon
            ></md-button>`
      : null}
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isReblogged ||
          state.tweet?.reblogged
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              size="small"
              @click="${() => handlers.reblog(state.tweet?.id || '')}"
              >${state.tweet?.reblogs_count}
              <md-icon slot="suffix" name="repeat"></md-icon
            ></md-button>`
      : null}
      </div>
    </md-card>
  `;
}

export function renderReblog(
  state: TimelineItemState,
  handlers: TimelineItemHandlers
) {
  if (!state.tweet?.reblog) return null;

  return html`
    <md-card slot="card">
      ${state.tweet.reblog.media_attachments.length > 0
      ? html`
            <image-carousel
              .images="${state.tweet.reblog.media_attachments}"
              slot="image"
            >
            </image-carousel>
          `
      : html``}

      <div class="header-block reblog-header" slot="header">
        <user-profile
          ?small="${true}"
          .account="${state.tweet.reblog.account}"
        ></user-profile>

        <div class="boosted-by">
          <span>Boosted by</span>
          <user-profile
            boosted
            class="smaller-profile"
            ?small="${true}"
            .account="${state.tweet.account}"
          ></user-profile>
        </div>
        <md-icon-button
          @click="${() => handlers.shareStatus(state.tweet || null)}"
          name="share"
          label="Share"
        >
        </md-icon-button>
      </div>

      <div
        @click="${() => handlers.openPost()}"
        .innerHTML="${state.tweet.reblog.content || ''}"
      ></div>

      <div class="actions" slot="footer">
        ${state.show === true
      ? html`<md-button
              variant="text"
              pill
              size="small"
              style="--md-sys-color-primary: #878792"
              @click="${() => handlers.replies()}"
            >
              <md-icon slot="suffix" name="chatbox"></md-icon>
            </md-button>`
      : null}
        <md-button
          variant="text"
          style="--md-sys-color-primary: ${state.isBookmarked
      ? 'var(--sl-color-primary-600)'
      : '#878792'}"
          pill
          size="small"
          @click="${() => handlers.bookmark(state.tweet?.id || '')}"
          ><md-icon slot="suffix" name="bookmark"></md-icon
        ></md-button>
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isBoosted ||
          state.tweet?.favourited
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              size="small"
              @click="${() => handlers.favorite(state.tweet?.id || '')}"
              >${state.tweet.reblog.favourites_count}
              <md-icon slot="suffix" name="heart"></md-icon
            ></md-button>`
      : null}
        ${state.settings && state.settings.wellness === false
      ? html`<md-button
              variant="text"
              style="--md-sys-color-primary: ${state.isReblogged ||
          state.tweet?.reblogged
          ? 'var(--sl-color-primary-600)'
          : '#878792'}"
              pill
              size="small"
              @click="${() => handlers.reblog(state.tweet?.id || '')}"
              >${state.tweet.reblog.reblogs_count}
              <md-icon slot="suffix" name="repeat"></md-icon
            ></md-button>`
      : null}
      </div>
    </md-card>
  `;
}

export function renderThread(
  state: TimelineItemState,
  handlers: TimelineItemHandlers
) {
  if (!state.threadExpanded || state.threadPosts.length === 0) return null;

  return html`
    <div class="thread-line"></div>
    <div class="thread-continuation">
      ${state.threadPosts.map(
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
                style="--md-sys-color-primary: ${threadPost.bookmarked
        ? 'var(--sl-color-primary-600)'
        : '#878792'}"
                pill
                size="small"
                @click="${() => handlers.bookmark(threadPost.id)}"
                ><md-icon slot="suffix" name="bookmark"></md-icon
              ></md-button>
              ${state.settings && state.settings.wellness === false
        ? html`<md-button
                    variant="text"
                    style="--md-sys-color-primary: ${threadPost.favourited
            ? 'var(--sl-color-primary-600)'
            : '#878792'}"
                    pill
                    size="small"
                    @click="${() => handlers.favorite(threadPost.id)}"
                    >${threadPost.favourites_count}
                    <md-icon slot="suffix" name="heart"></md-icon
                  ></md-button>`
        : null}
              ${state.settings && state.settings.wellness === false
        ? html`<md-button
                    variant="text"
                    style="--md-sys-color-primary: ${threadPost.reblogged
            ? 'var(--sl-color-primary-600)'
            : '#878792'}"
                    pill
                    size="small"
                    @click="${() => handlers.reblog(threadPost.id)}"
                    >${threadPost.reblogs_count}
                    <md-icon slot="suffix" name="repeat"></md-icon
                  ></md-button>`
        : null}
            </div>
          </md-card>
        `
  )}
    </div>
  `;
}
