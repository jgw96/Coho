import { LitElement } from 'lit';
import './md-toast.js';
export declare class OfflineNotify extends LitElement {
    network_status: boolean;
    back_online: boolean;
    static styles: import("lit").CSSResult[];
    constructor();
    showOfflineToast(): void;
    showBackOnlineToast(): void;
    render(): import("lit-html").TemplateResult<1>;
}
