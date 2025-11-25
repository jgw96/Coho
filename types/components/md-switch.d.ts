import { LitElement } from 'lit';
/**
 * Material Design 3 Switch
 * Accessible toggle control with MD3 colors, motion, and states.
 */
export declare class MdSwitch extends LitElement {
    checked: boolean;
    disabled: boolean;
    static styles: import("lit").CSSResult;
    private _onClick;
    private _onKeyDown;
    private _emitChange;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-switch': MdSwitch;
    }
}
