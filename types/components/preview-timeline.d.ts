import { LitElement } from 'lit';
import { Post } from '../interfaces/Post';
import '../components/timeline-item';
import '@lit-labs/virtualizer';
export declare class PreviewTimeline extends LitElement {
    timeline: Post[];
    loadingData: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    /** Handle visibility changes from lit-virtualizer to trigger load more */
    private _handleVisibilityChanged;
    loadMore(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
