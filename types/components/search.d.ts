import { LitElement } from 'lit';
import './md-text-field';
export declare class Search extends LitElement {
    searchData: any | undefined;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    handleSearch(value: string): Promise<void>;
    openAccount(id: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
