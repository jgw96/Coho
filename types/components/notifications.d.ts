import { LitElement } from 'lit';
import './user-profile';
import './timeline-item';
import './md-dialog';
import './md-switch';
import './md-button';
import '@shoelace-style/shoelace/dist/components/divider/divider';
import { Post } from '../interfaces/Post';
export declare class Notifications extends LitElement {
    notifications: never[];
    subbed: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    clear(): Promise<void>;
    sub(flag: boolean): Promise<void>;
    openPost(tweet: Post): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
