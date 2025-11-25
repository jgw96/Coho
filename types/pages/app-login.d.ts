import { LitElement } from 'lit';
import '../components/md-text-field';
import '../components/md-button';
import '../components/md-card';
export declare class AppLogin extends LitElement {
    loadIntro: boolean;
    instances: any[];
    chosenServer: string;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    login(): Promise<void>;
    openIntro(): Promise<void>;
    scrollToItem(scroller: any, width: number): void;
    next(): void;
    getStarted(): Promise<void>;
    handleServerInput(event: any): void;
    joinMastodon(): void;
    explore(): void;
    render(): import("lit-html").TemplateResult<1>;
}
