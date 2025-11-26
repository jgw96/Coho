import { LitElement } from 'lit';
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
/**
 * Material Design 3 Toast (Snackbar) Component
 *
 * A brief message that appears at the bottom of the screen to provide feedback.
 * Follows MD3 design guidelines for snackbars.
 *
 * @example
 * ```html
 * <md-toast
 *   message="Item deleted"
 *   action-label="Undo"
 *   @action-click=${handleUndo}>
 * </md-toast>
 * ```
 *
 * @fires show - Dispatched when toast is shown
 * @fires hide - Dispatched when toast is hidden
 * @fires action-click - Dispatched when action button is clicked
 */
export declare class MdToast extends LitElement {
    /** The message to display in the toast */
    message: string;
    /** Optional action button label */
    actionLabel: string;
    /** Duration in milliseconds (0 = persistent until dismissed) */
    duration: number;
    /** Visual variant of the toast */
    variant: ToastVariant;
    /** Whether to show a close button */
    closable: boolean;
    /** Controls visibility */
    open: boolean;
    /** Position on screen */
    position: 'bottom' | 'top';
    private hideTimer?;
    static styles: import("lit").CSSResult;
    /**
     * Show the toast programmatically
     */
    show(): void;
    /**
     * Hide the toast programmatically
     */
    hide(): void;
    /**
     * Convenience method to show toast with a message
     */
    toast(message?: string): void;
    disconnectedCallback(): void;
    private handleActionClick;
    private handleCloseClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-toast': MdToast;
    }
}
