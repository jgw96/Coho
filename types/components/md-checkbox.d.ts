import { LitElement } from 'lit';
/**
 * Material Design 3 Checkbox
 * Accessible checkbox control with MD3 colors, motion, and states.
 */
export declare class MdCheckbox extends LitElement {
    checked: boolean;
    disabled: boolean;
    value: string;
    static styles: import("lit").CSSResult;
    private _onClick;
    private _onKeyDown;
    private _emitChange;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-checkbox': MdCheckbox;
    }
}
