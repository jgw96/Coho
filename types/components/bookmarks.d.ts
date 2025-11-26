import { LitElement } from 'lit';
import './timeline-item';
import './md/md-skeleton-card';
export declare class Bookmarks extends LitElement {
    bookmarks: never[];
    isLoading: boolean;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
