import { LitElement } from 'lit';
import './md/md-text-field';
import './md/md-text-area';
import './md/md-checkbox';
import './md/md-button';
export declare class EditAccount extends LitElement {
    newAvatar: File | null;
    newHeader: File | null;
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    resetForm(): Promise<void>;
    submitProfile(): Promise<void>;
    changeAvatar(): Promise<void>;
    changeHeader(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
