import { LitElement } from 'lit';
/**
 * Material Design 3 Select Component
 * A dropdown selector that displays a list of options.
 * Replaces fluent-combobox with MD3 styling.
 */
export declare class MdSelect extends LitElement {
    value: string;
    placeholder: string;
    disabled: boolean;
    variant: 'filled' | 'outlined';
    pill: boolean;
    private _open;
    private _options;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    private _updateOptions;
    private _handleKeydown;
    private _handleInputClick;
    private _handleBackdropClick;
    private _handleOptionClick;
    private _close;
    private _getDisplayLabel;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-select': MdSelect;
    }
}
