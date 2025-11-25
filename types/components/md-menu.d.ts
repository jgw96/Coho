import { LitElement } from 'lit';
/**
 * Material Design 3 Menu Component
 * A menu displays a list of choices on a temporary surface
 */
export declare class MdMenu extends LitElement {
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-menu': MdMenu;
    }
}
