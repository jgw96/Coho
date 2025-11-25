import { LitElement } from 'lit';
export declare class UserProfile extends LitElement {
    account: any | undefined;
    small: boolean;
    boosted: boolean;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    loadImage(): void;
    openUser(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
