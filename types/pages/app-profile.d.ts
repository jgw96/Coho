import { LitElement } from 'lit';
import '../components/timeline-item';
import '../components/md-dialog';
import '../components/md-text-area';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '../components/md-badge';
import { Post } from '../interfaces/Post';
export declare class AppProfile extends LitElement {
    user: any | undefined;
    posts: any[];
    followed: boolean;
    following: boolean;
    showMiniProfile: boolean;
    selectedPost: Post | undefined;
    isOwnProfile: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    follow(): Promise<void>;
    reloadPosts(): Promise<void>;
    unfollow(): Promise<void>;
    editPost(tweet: Post): void;
    confirmEdit(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
