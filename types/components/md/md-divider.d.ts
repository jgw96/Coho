import { LitElement } from 'lit';
/**
 * md-divider - A simple Material Design 3 divider
 *
 * A thin line used to separate content in lists and layouts.
 */
export declare class MdDivider extends LitElement {
    static styles: import("lit").CSSResult;
    /** Whether to inset the divider on both sides */
    inset: boolean;
    /** Whether to inset the divider on the start side only */
    insetStart: boolean;
    /** Whether to inset the divider on the end side only */
    insetEnd: boolean;
    /** Whether the divider is vertical */
    vertical: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-divider': MdDivider;
    }
}
