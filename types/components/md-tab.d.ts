import { LitElement } from 'lit';
/**
 * MD3 Tab Button
 *
 * Individual tab button within md-tabs container.
 * Follows Material Design 3 primary tabs specification.
 *
 * @fires tab-selected - Emitted when tab is clicked { detail: { panel: string } }
 *
 * @slot default - Tab label content
 * @slot icon - Optional icon before label
 *
 * @example
 * ```html
 * <md-tab slot="nav" panel="accounts">
 *   <md-icon slot="icon" name="person"></md-icon>
 *   Accounts
 * </md-tab>
 * ```
 */
export declare class MdTab extends LitElement {
    /**
     * Panel ID this tab controls
     */
    panel: string;
    /**
     * Whether tab is currently active
     */
    active: boolean;
    /**
     * Whether tab is disabled
     */
    disabled: boolean;
    static styles: import("lit").CSSResult;
    private _handleClick;
    private _handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-tab': MdTab;
    }
}
