import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Post } from '../interfaces/Post';
import { getPreviewTimeline } from '../services/timeline';

import '../components/timeline-item';
import '../components/md/md-virtual-list';

@customElement('preview-timeline')
export class PreviewTimeline extends LitElement {
  @state() timeline: any[] = [];
  @state() loadingData = false;

  static styles = [
    css`
      :host {
        display: block;
      }

      ul {
        display: flex;
        flex-direction: column;
        border-radius: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
        width: 100%;

        height: 90vh;
        overflow-y: scroll;
        overflow-x: hidden;
      }

      md-virtual-list {
        height: 90vh;
        width: 100%;
      }

      #load-more {
        height: 10px;
      }

      ul::-webkit-scrollbar,
      md-virtual-list::-webkit-scrollbar {
        display: none;
      }

      li {
        width: 100%;
      }
    `,
  ];

  async firstUpdated() {
    const previewData = await getPreviewTimeline();
    this.timeline = previewData;
  }

  private async _handleLoadMore() {
    if (this.loadingData) return;

    this.loadingData = true;
    await this.loadMore();
    this.loadingData = false;
  }

  async loadMore() {
    const previewData = await getPreviewTimeline();
    this.timeline = [...this.timeline, ...previewData];
  }

  render() {
    return html`
      <ul part="parent">
        <md-virtual-list
          part="list"
          .items="${this.timeline}"
          .keyFn="${(tweet: any) => tweet.id}"
          .renderItem="${(tweet: Post) => html`
            <timeline-item ?show="${false}" .tweet="${tweet}"></timeline-item>
          `}"
          .loading="${this.loadingData}"
          @load-more="${this._handleLoadMore}"
        >
        </md-virtual-list>

        <li id="load-more"></li>
      </ul>
    `;
  }
}
