import { LitElement } from 'lit';
import './md/md-skeleton-card';
export declare class Favorites extends LitElement {
    favorites: never[];
    isLoading: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
