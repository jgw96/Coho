import { LitElement } from 'lit';
import './md/md-dialog';
import './md/md-select';
import './md/md-option';
import './md/md-text-area';
import './md/md-checkbox';
import './md/md-button';
export interface ReportSubmitDetail {
    accountId: string;
    statusId?: string;
    category: 'spam' | 'legal' | 'violation' | 'other';
    comment: string;
    forward: boolean;
}
/**
 * Report Dialog Component
 * A dialog for reporting users to moderators with category selection,
 * comment field, and option to forward to remote instance.
 */
export declare class ReportDialog extends LitElement {
    accountId: string;
    statusId?: string;
    accountAcct: string;
    open: boolean;
    private _category;
    private _comment;
    private _forward;
    private _submitting;
    static styles: import("lit").CSSResult;
    private get _isRemoteAccount();
    private _handleCategoryChange;
    private _handleCommentInput;
    private _handleForwardChange;
    private _handleCancel;
    private _handleSubmit;
    private _resetForm;
    show(): void;
    hide(): void;
    setSubmitting(value: boolean): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'report-dialog': ReportDialog;
    }
}
