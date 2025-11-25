import { LitElement } from 'lit';
/**
 * Material Design 3 Text Field Component
 * A single-line text input field with MD3 styling.
 * Replaces fluent-text-field with MD3 styling.
 */
export declare class MdTextField extends LitElement {
    value: string;
    placeholder: string;
    disabled: boolean;
    autofocus: boolean;
    variant: 'filled' | 'outlined';
    pill: boolean;
    type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
    private _input;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    firstUpdated(): void;
    private _handleInput;
    private _handleChange;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-text-field': MdTextField;
    }
}
