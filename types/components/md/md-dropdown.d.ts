import { LitElement } from 'lit';
/**
 * Material Design 3 Dropdown
 * Shows a popup surface when trigger is clicked. Content can be anything (md-menu, form, etc).
 *
 * The popup is hoisted to the document body to escape overflow clipping from parent containers.
 */
export declare class MdDropdown extends LitElement {
    open: boolean;
    placement: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    distance: number;
    triggerSlot: HTMLSlotElement;
    contentSlot: HTMLSlotElement;
    private _popupContainer;
    private _backdrop;
    private _movedElements;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _handleEscape;
    private _handleTriggerClick;
    private _createPopup;
    private _handlePopupClick;
    private _cleanup;
    show(): void;
    hide(): void;
    private _positionPopup;
    private _handleBackdropClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-dropdown': MdDropdown;
    }
}
