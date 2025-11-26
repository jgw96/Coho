import { LitElement } from 'lit';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import '../components/md/md-virtual-list';
import '../components/timeline-item';
import '../components/search';
import { Post } from '../interfaces/Post';
export declare class MediaTimeline extends LitElement {
    timeline: Post[];
    loadingData: boolean;
    timelineType: 'Home' | 'Public' | 'Media';
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    private _handleLoadMore;
    refreshTimeline(): Promise<void>;
    loadMore(): Promise<void>;
    handleReplies(data: Array<Post>): void;
    render(): import("lit-html").TemplateResult<1>;
}
