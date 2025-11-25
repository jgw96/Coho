import { LitElement } from 'lit';
/**
 * Material Design 3 Text Area Component
 * A multi-line text input field with MD3 styling.
 * Replaces fluent-text-area with MD3 styling.
 */
export declare class MdTextArea extends LitElement {
    value: string;
    placeholder: string;
    disabled: boolean;
    autofocus: boolean;
    variant: 'filled' | 'outlined';
    rows: number;
    maxlength?: number;
    private _textarea;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    firstUpdated(): void;
    private _handleInput;
    private _handleChange;
    focus(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-text-area': MdTextArea;
    }
}
