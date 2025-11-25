import { LitElement } from 'lit';
/**
 * Material Design 3 Option Component
 * Represents a single option within an md-select dropdown.
 * Replaces fluent-option with MD3 styling.
 */
export declare class MdOption extends LitElement {
    value: string;
    disabled: boolean;
    selected: boolean;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-option': MdOption;
    }
}
