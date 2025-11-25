import { LitElement } from 'lit';
import './md-dialog.js';
import './md-button.js';
import './md-text-area.js';
import './md-skeleton.js';
export declare class MediaEditDialog extends LitElement {
    open: boolean;
    imageSrc: string;
    description: string;
    mediaId: string;
    imageLoaded: boolean;
    static styles: import("lit").CSSResult;
    willUpdate(changedProperties: Map<string, any>): void;
    private handleImageLoad;
    private handleSave;
    private close;
    private handleDialogHide;
    private handleDialogShow;
    render(): import("lit-html").TemplateResult<1>;
}
