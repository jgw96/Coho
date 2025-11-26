import { LitElement } from 'lit';
/**
 * MD3 Tab Panel
 *
 * Content container for tabs. Visibility controlled by parent md-tabs component.
 *
 * @slot default - Panel content
 *
 * @example
 * ```html
 * <md-tab-panel name="accounts">
 *   <p>Account list content here</p>
 * </md-tab-panel>
 * ```
 */
export declare class MdTabPanel extends LitElement {
    /**
     * Panel identifier matching md-tab's panel property
     */
    name: string;
    /**
     * Whether panel is currently active (visible)
     */
    active: boolean;
    static styles: import("lit").CSSResult;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-tab-panel': MdTabPanel;
    }
}
