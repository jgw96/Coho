import { LitElement } from 'lit';
/**
 * Material Design 3 Toolbar Component
 * A toolbar provides access to actions and navigation
 */
export declare class MdToolbar extends LitElement {
    position: 'top' | 'bottom' | 'static';
    align: 'start' | 'center' | 'end';
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-toolbar': MdToolbar;
    }
}
