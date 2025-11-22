import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '../components/md-text-field';
import '../components/md-button';
import '../components/md-card';

import { router } from '../utils/router';
import { enableVibrate } from '../utils/handle-vibrate';

let scrollWidth: number = 0;

@customElement('app-login')
export class AppLogin extends LitElement {
  @state() loadIntro: boolean = false;
  @state() instances: any[] = [];
  @state() chosenServer: string = '';

  static styles = [
    css`
      :host {
        display: block;
        --md-sys-color-surface-container: #f0f4f8;
      }

      @media (prefers-color-scheme: dark) {
        :host {
          --md-sys-color-surface-container: #1a1c1e;
        }
      }

      main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        width: 100%;
        background-color: var(--md-sys-color-surface-container);
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }

      .background-decoration {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle at center,
          var(--md-sys-color-primary-container, #eaddff) 0%,
          transparent 50%
        );
        opacity: 0.3;
        z-index: 0;
        pointer-events: none;
      }

      md-card {
        max-width: 400px;
        width: 100%;
        z-index: 1;
        --md-card-padding: 32px;
      }

      .login-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-bottom: 24px;
      }

      .logo {
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface);
      }

      .subtitle {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--md-sys-color-on-surface-variant);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;
        align-items: center;
      }

      md-text-field {
        width: 100%;
      }

      .login-button {
        --md-button-height: 48px;
      }

      .login-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        width: 100%;
      }

      .app-footer {
        margin-top: 24px;
        font-size: 12px;
        color: var(--md-sys-color-on-surface-variant);
        z-index: 1;
      }

      .app-footer a {
        color: inherit;
        text-decoration: none;
      }

      .app-footer a:hover {
        text-decoration: underline;
      }

      md-dialog::part(base) {
        z-index: 99999;
      }

      md-dialog::part(panel) {
        backdrop-filter: blur(80px);
        width: min(600px, 90vw);
        max-height: 85vh;
      }

      md-dialog a {
        color: var(--sl-color-primary-600);
      }

      #intro-carousel {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        gap: 0;
        width: 100%;
      }

      .scroll-item {
        flex: 0 0 100%;
        scroll-snap-align: center;
        padding: 0 4px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }

      .scroll-item md-button {
        align-self: center;
        margin-top: 16px;
      }

      @media (max-width: 820px) {
        md-card {
          box-shadow: none;
          background: transparent;
          border: none;
        }

        main {
          justify-content: flex-start;
          padding-top: 40px;
        }
      }
    `,
  ];

  async firstUpdated() {
    // get code and state from url
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    const accessToken = localStorage.getItem('accessToken');

    const server = localStorage.getItem('server');

    if (code && state) {
      const { authToClient } = await import('../services/account');

      await authToClient(code, state);

      await router.navigate('/home');
    } else if (accessToken && server) {
      await router.navigate('/home');
    }

    window.requestIdleCallback(() => {
      if (this.shadowRoot) {
        enableVibrate(this.shadowRoot);
      }
    });
  }

  async login() {
    let serverURL = this.chosenServer;
    if (serverURL.length > 0) {
      if (serverURL.includes('https://')) {
        // remove https://
        serverURL = serverURL.replace('https://', '');
      }

      try {
        const { initAuth } = await import('../services/account');
        await initAuth(serverURL);
      } catch (err) {
        console.error(err);
      }
    }
  }

  async openIntro() {
    await import('../components/md-dialog.js');
    this.loadIntro = true;

    await this.updateComplete;

    const dialog = this.shadowRoot?.querySelector('md-dialog') as any;

    dialog.show();
  }

  scrollToItem(scroller: any, width: number) {
    const newWidth = scrollWidth + width;
    scrollWidth = newWidth;

    scroller.scrollTo({
      top: 0,
      left: newWidth,
      behavior: 'smooth',
    });
  }

  next() {
    const scroller = this.shadowRoot?.querySelector('#intro-carousel') as any;

    this.scrollToItem(scroller, 1000);
  }

  async getStarted() {
    const dialog = this.shadowRoot?.querySelector('md-dialog') as any;
    await dialog.hide();

    scrollWidth = 0;
  }

  handleServerInput(event: any) {
    console.log(event.target.value);

    this.chosenServer = event.target.value;
  }

  joinMastodon() {
    // open https://joinmastodon.org/servers in new tab
    router.navigate('/createaccount');
  }

  explore() {
    router.navigate('/explore');
  }

  render() {
    return html`
      ${this.loadIntro
        ? html`
            <md-dialog label="Intro To Mastodon">
              <div id="intro-carousel" class="scrollbar-hidden">
                <div class="scroll-item">
                  <h2>What is Coho?</h2>
                  <p>
                    Coho is the app your using 😊. It is an open source,
                    cross-platform Mastodon client. Coho brings the best of
                    Mastodon to any device, with a fast and intuitive interface,
                    no matter your device or internet connection. To use Coho,
                    you need a Mastodon account. Once you have a Mastodon
                    account you will need to enter the URL of the Mastodon
                    instance you signed up at.
                  </p>

                  <md-button variant="text" pill @click="${() => this.next()}"
                    >Next</md-button
                  >
                </div>

                <div class="scroll-item">
                  <h2>What Is Mastodon?</h2>
                  <p>
                    Mastodon is a social media platform that allows users to
                    create and share short posts, called "toots," and interact
                    with each other through features like boosting, direct
                    messaging, and hashtags. It is decentralized, meaning that
                    it is not controlled by a central authority and users can
                    choose which communities, called "instances," they want to
                    join. Mastodon is open-source and free to use.
                  </p>

                  <p>
                    Each instance is run by a different administrator and can
                    have its own rules and moderation policies.
                  </p>

                  <md-button variant="text" pill @click="${() => this.next()}"
                    >Next</md-button
                  >
                </div>

                <div class="scroll-item">
                  <h2>How do I join Mastodon?</h2>

                  <ol>
                    <li>
                      Go to
                      <a href="https://joinmastodon.org/"
                        >https://joinmastodon.org/</a
                      >
                      and select an instance to sign up for. There are many
                      different Mastodon instances to choose from, each with its
                      own rules and community guidelines. You can read more
                      about each instance to find one that fits your interests.
                    </li>
                    <li>
                      Click the "Sign up" button on the instance you have
                      chosen.
                    </li>
                    <li>
                      Fill out the sign-up form with your desired username,
                      email address, and password.
                    </li>
                    <li>
                      Read and agree to the terms of service for the instance.
                    </li>
                    <li>
                      Click the "Sign up" button to complete the registration
                      process.
                    </li>
                    <li>
                      You will receive an email with a confirmation link. Click
                      the link to confirm your email address and complete the
                      sign-up process.
                    </li>
                    <li>
                      Once you have confirmed your email, you can log in to
                      Mastodon and start using the platform.
                    </li>
                  </ol>
                  <p>
                    Note: Some instances may have additional requirements or
                    restrictions for new users, such as requiring a valid email
                    address or approving new accounts manually. Be sure to read
                    the rules and guidelines of the instance you are joining
                    before signing up.
                  </p>

                  <md-button
                    variant="filled"
                    pill
                    @click="${() => this.getStarted()}"
                    >Get Started</md-button
                  >
                </div>
              </div>
            </md-dialog>
          `
        : null}

      <main>
        <div class="background-decoration"></div>

        <md-card class="login-card" variant="elevated">
          <div class="login-header">
            <img
              src="/assets/icons/new-icons/icon-144x144.webp"
              alt="Coho Logo"
              class="logo"
            />
            <h1>Welcome to Coho</h1>
            <p class="subtitle">Your modern Mastodon client</p>
          </div>

          <div class="login-form">
            <md-text-field
              placeholder="mastodon.social"
              .value="${this.chosenServer}"
              @input="${this.handleServerInput}"
              @change="${this.handleServerInput}"
              type="url"
            >
            </md-text-field>

            <md-button
              @click="${() => this.login()}"
              variant="filled"
              class="login-button"
            >
              Login
            </md-button>
          </div>

          <div slot="footer" class="login-actions">
            <md-button @click="${() => this.joinMastodon()}" variant="text">
              Sign up for Mastodon Account
            </md-button>
            <md-button @click="${() => this.openIntro()}" variant="text">
              Intro To Mastodon
            </md-button>
            <md-button @click="${() => this.explore()}" variant="text">
              Explore without an account
            </md-button>
          </div>
        </md-card>

        <div class="app-footer">
          <a href="https://github.com/jgw96/mammoth-app#readme" target="_blank">
            Learn More about Coho
          </a>
        </div>
      </main>
    `;
  }
}
