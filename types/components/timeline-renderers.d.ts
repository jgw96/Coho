import { Post } from '../interfaces/Post';
import '../components/user-profile';
import '../components/md-card';
import '../components/md-icon';
import '../components/md-icon-button';
import '../components/image-carousel';
import '../components/md-button';
export interface TimelineItemHandlers {
    viewSensitive: () => void;
    replies: () => void;
    bookmark: (id: string) => void;
    favorite: (id: string) => void;
    reblog: (id: string) => void;
    translatePost: (content: string | null) => void;
    shareStatus: (tweet: Post | null) => void;
    deleteStatus: () => void;
    initEditStatus: () => void;
    openPost: () => void;
    openLinkCard: (url: string) => void;
    showThread: () => void;
}
export interface TimelineItemState {
    tweet: Post | undefined;
    show: boolean;
    currentUser: any;
    settings: any;
    isBookmarked: boolean;
    isBoosted: boolean;
    isReblogged: boolean;
    loadingThread: boolean;
    threadExpanded: boolean;
    threadPosts: Post[];
}
export declare function renderSensitive(state: TimelineItemState, handlers: TimelineItemHandlers): import("lit-html").TemplateResult<1>;
export declare function renderReplyContext(state: TimelineItemState, handlers: TimelineItemHandlers): import("lit-html").TemplateResult<1> | null;
export declare function renderRegularTweet(state: TimelineItemState, handlers: TimelineItemHandlers): import("lit-html").TemplateResult<1>;
export declare function renderReblog(state: TimelineItemState, handlers: TimelineItemHandlers): import("lit-html").TemplateResult<1> | null;
export declare function renderThread(state: TimelineItemState, handlers: TimelineItemHandlers): import("lit-html").TemplateResult<1> | null;
