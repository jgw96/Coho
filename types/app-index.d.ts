import { LitElement } from 'lit';
import './pages/app-login';
import './components/header';
import './components/image-preview-dialog';
export declare class AppIndex extends LitElement {
    static get styles(): import("lit").CSSResult;
    constructor();
    connectedCallback(): Promise<void>;
    /**
     * Warm the service worker cache for notifications, bookmarks, and favorites
     * Only if user has good network and data saver is off
     */
    private warmCacheIfAppropriate;
    /**
     * Apply theme color to both Shoelace and MD3 design tokens
     */
    private applyThemeColor;
    /**
     * Adjust color brightness (from app-theme component)
     */
    private adjustColorBrightness;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
