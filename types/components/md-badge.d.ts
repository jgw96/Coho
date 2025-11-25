import { LitElement } from 'lit';
/**
 * Material Design 3 Badge Component
 * A badge displays a descriptor for a UI element (e.g., count, status)
 */
export declare class MdBadge extends LitElement {
    variant: 'filled' | 'outlined';
    clickable: boolean;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
    private _handleClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-badge': MdBadge;
    }
}
