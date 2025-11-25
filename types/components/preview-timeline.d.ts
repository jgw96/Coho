import { LitElement } from 'lit';
import '../components/timeline-item';
import '@lit-labs/virtualizer';
export declare class PreviewTimeline extends LitElement {
    timeline: any[];
    loadingData: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    loadMore(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
