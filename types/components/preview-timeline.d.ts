import { LitElement } from 'lit';
import '../components/timeline-item';
import '../components/md/md-virtual-list';
export declare class PreviewTimeline extends LitElement {
    timeline: any[];
    loadingData: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    private _handleLoadMore;
    loadMore(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
