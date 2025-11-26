import { LitElement, html, css } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import './md/md-icon-button';
import './md/md-icon';
import './md/md-skeleton';

@customElement('image-preview-dialog')
export class ImagePreviewDialog extends LitElement {
  @state() open: boolean = false;
  @state() src: string = '';
  @state() alt: string = '';
  @state() width: number = 0;
  @state() height: number = 0;
  @state() loaded: boolean = false;

  @query('dialog') dialog!: HTMLDialogElement;

  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      background: transparent;
      border: none;
      padding: 0;
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
    }

    md-skeleton {
      height: 280px !important;
    }

    dialog::backdrop {
      background-color: rgb(0 0 0 / 0%);
      backdrop-filter: blur(36px);
    }

    .container {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: 1fr auto;
      align-items: center;
      justify-items: center;
      padding: 24px;
      box-sizing: border-box;
    }

    .image-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      isolation: isolate;
    }

    md-skeleton {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease-out;
      z-index: 1;
    }

    md-skeleton.hidden {
      opacity: 0;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 4px;
      cursor: default;
      opacity: 0;
      transition: opacity 0.3s ease-in;
      position: relative;
      z-index: 2;
    }

    img.loaded {
      opacity: 1;
    }

    .caption {
      margin-top: 16px;
      color: #e6e1e5;
      text-align: center;
      max-height: 10vh;
      overflow-y: auto;
      font-family: var(
        --md-sys-typescale-body-large-font-family-name,
        Roboto,
        sans-serif
      );
      font-size: var(--md-sys-typescale-body-large-font-size, 16px);
      max-width: 800px;
      background: rgba(0, 0, 0, 0.6);
      padding: 8px 16px;
      border-radius: 24px;
    }

    .close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 10;
      color: white;
      --md-sys-color-on-surface-variant: white;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
    }

    .close-button:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      'preview-image',
      this.handlePreviewImage as EventListener
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'preview-image',
      this.handlePreviewImage as EventListener
    );
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        if (this.dialog && !this.dialog.open) this.dialog.showModal();
      } else {
        if (this.dialog && this.dialog.open) this.dialog.close();
      }
    }
  }

  private handlePreviewImage = (e: CustomEvent) => {
    this.src = e.detail.src;
    this.alt = e.detail.alt;
    this.width = e.detail.width;
    this.height = e.detail.height;
    this.loaded = false;
    this.open = true;
  };

  private close() {
    this.open = false;
    // Delay clearing src to avoid flicker during close animation
    setTimeout(() => {
      this.src = '';
      this.alt = '';
      this.width = 0;
      this.height = 0;
      this.loaded = false;
    }, 200);
  }

  private handleBackdropClick(e: MouseEvent) {
    // Close if clicking on the container or image wrapper (backdrop area)
    // But not if clicking on the image itself or caption
    const target = e.target as HTMLElement;
    if (
      target === this.dialog ||
      target.classList.contains('container') ||
      target.classList.contains('image-wrapper')
    ) {
      this.close();
    }
  }

  render() {
    return html`
      <dialog @close="${this.close}" @click="${this.handleBackdropClick}">
        <md-icon-button class="close-button" @click="${this.close}">
          <md-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </md-icon>
        </md-icon-button>

        <div class="container">
          <div class="image-wrapper">
            <md-skeleton
              class="${this.loaded ? 'hidden' : ''}"
              style="width: 100%; height: 280px;"
            ></md-skeleton>
            <img
              class="${this.loaded ? 'loaded' : ''}"
              src="${this.src}"
              alt="${this.alt}"
              width="${ifDefined(this.width || undefined)}"
              @click="${(e: Event) => e.stopPropagation()}"
              @load="${() => (this.loaded = true)}"
            />
          </div>
          ${this.alt
            ? html`<div
                class="caption"
                @click="${(e: Event) => e.stopPropagation()}"
              >
                ${this.alt}
              </div>`
            : ''}
        </div>
      </dialog>
    `;
  }
}
