import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import './md-toast.js';

@customElement('offline-notify')
export class OfflineNotify extends LitElement {
  @state() public network_status: boolean = true;
  @state() back_online: boolean = false;

  static styles = [
    css`
      :host {
        display: block;
      }

      .offline {
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ];

  constructor() {
    super();

    window.addEventListener('offline', () => {
      this.network_status = false;

      this.showOfflineToast();
    });

    window.addEventListener('online', () => {
      if (this.network_status === false) {
        this.network_status = true;

        this.showBackOnlineToast();
      }
    });

    this.network_status = navigator.onLine;
  }

  showOfflineToast() {
    const toast = this.shadowRoot?.getElementById('offline-toast') as any;
    if (toast) {
      toast.show();
    }
  }

  showBackOnlineToast() {
    const toast = this.shadowRoot?.getElementById('back-online-toast') as any;
    if (toast) {
      toast.show();
    }
  }

  render() {
    return html`
      <md-toast
        id="offline-toast"
        variant="warning"
        duration="4000"
        closable
        message="You have entered offline mode. Otter will still work, including if you close and reopen the app, but some functionality may be limited.">
      </md-toast>

      <md-toast
        id="back-online-toast"
        variant="success"
        duration="3000"
        closable
        message="You are back online. Otter will resume normal functionality.">
      </md-toast>
    `;
  }
}
