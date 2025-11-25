import { LitElement } from 'lit';
import '../components/header';
import '../components/timeline-item';
import '../components/md-icon';
import '../components/md-icon-button';
import '../components/md-text-area';
import { Post } from '../interfaces/Post';
export declare class PostDetail extends LitElement {
    tweet: Post | null;
    replies: any[];
    replyingTo: Post | null;
    passed_tweet: Post | null;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    firstUpdated(): Promise<void>;
    private loadReplies;
    shareStatus(): Promise<void>;
    handleReply(): Promise<void>;
    handleReplyClick(e: CustomEvent): void;
    render(): import("lit-html").TemplateResult<1>;
}
