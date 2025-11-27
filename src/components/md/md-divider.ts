import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * md-divider - A simple Material Design 3 divider
 *
 * A thin line used to separate content in lists and layouts.
 */
@customElement('md-divider')
export class MdDivider extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .divider {
      height: 1px;
      background: var(--md-sys-color-outline-variant, rgba(0, 0, 0, 0.12));
      margin: 0;
      border: none;
    }

    :host([inset]) .divider {
      margin-left: 16px;
      margin-right: 16px;
    }

    :host([inset-start]) .divider {
      margin-left: 16px;
    }

    :host([inset-end]) .divider {
      margin-right: 16px;
    }

    :host([vertical]) {
      display: inline-block;
      width: auto;
      height: 100%;
    }

    :host([vertical]) .divider {
      width: 1px;
      height: 100%;
      min-height: 24px;
    }

    @media (prefers-color-scheme: dark) {
      .divider {
        background: var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.12));
      }
    }
  `;

  /** Whether to inset the divider on both sides */
  @property({ type: Boolean, reflect: true }) inset = false;

  /** Whether to inset the divider on the start side only */
  @property({ type: Boolean, reflect: true, attribute: 'inset-start' }) insetStart = false;

  /** Whether to inset the divider on the end side only */
  @property({ type: Boolean, reflect: true, attribute: 'inset-end' }) insetEnd = false;

  /** Whether the divider is vertical */
  @property({ type: Boolean, reflect: true }) vertical = false;

  render() {
    return html`<hr class="divider" part="divider" aria-hidden="true" />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-divider': MdDivider;
  }
}
