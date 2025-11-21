import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import './md-dialog';
import './md-button';

@customElement('image-preview-dialog')
export class ImagePreviewDialog extends LitElement {
    @state() open: boolean = false;
    @state() src: string = '';
    @state() alt: string = '';
    @state() width: number = 0;
    @state() height: number = 0;

    static styles = css`
    :host {
      display: block;
    }

    img {
      width: 100%;
      height: auto;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
    }

    p {
      text-align: center;
      margin-top: 8px;
      color: var(--md-sys-color-on-surface-variant);
    }

    md-dialog {
        --md-dialog-width: 90vw;
        --md-dialog-max-width: 1200px;
    }
  `;

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('preview-image', this.handlePreviewImage as EventListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('preview-image', this.handlePreviewImage as EventListener);
    }

    private handlePreviewImage = (e: CustomEvent) => {
        this.src = e.detail.src;
        this.alt = e.detail.alt;
        this.width = e.detail.width;
        this.height = e.detail.height;
        this.open = true;
    }

    private close() {
        this.open = false;
        this.src = '';
        this.alt = '';
        this.width = 0;
        this.height = 0;
    }

    render() {
        return html`
      <md-dialog .open="${this.open}" @md-dialog-hide="${this.close}" label="Image Preview">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <img src="${this.src}" alt="${this.alt}" width="${ifDefined(this.width || undefined)}" height="${ifDefined(this.height || undefined)}" />
            ${this.alt ? html`<p>${this.alt}</p>` : ''}
        </div>
      </md-dialog>
    `;
    }
}
