import { LitElement } from 'lit';
export interface AutocompleteOption {
    value: string;
    label: string;
    description?: string;
    icon?: string;
}
/**
 * Material Design 3 Autocomplete Component
 * A text input with dropdown suggestions following MD3 styling.
 */
export declare class MdAutocomplete extends LitElement {
    value: string;
    placeholder: string;
    disabled: boolean;
    autofocus: boolean;
    variant: 'filled' | 'outlined';
    pill: boolean;
    options: AutocompleteOption[];
    loading: boolean;
    private _showDropdown;
    private _highlightedIndex;
    private _isFocused;
    private _input;
    updated(changedProperties: Map<string, unknown>): void;
    static styles: import("lit").CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    private _handleOutsideClick;
    private _handleInput;
    private _handleFocus;
    private _handleBlur;
    private _handleKeyDown;
    private _selectOption;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-autocomplete': MdAutocomplete;
    }
}
