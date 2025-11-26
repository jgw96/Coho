import { LitElement } from 'lit';
import './md/md-icon-button';
import './md/md-icon';
import './md/md-skeleton';
export declare class ImagePreviewDialog extends LitElement {
    open: boolean;
    src: string;
    alt: string;
    width: number;
    height: number;
    loaded: boolean;
    dialog: HTMLDialogElement;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProperties: Map<string, any>): void;
    private handlePreviewImage;
    private close;
    private handleBackdropClick;
    render(): import("lit-html").TemplateResult<1>;
}
