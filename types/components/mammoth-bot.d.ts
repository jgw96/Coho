import { LitElement } from 'lit';
import '../components/md-text-area';
export declare class MammothBot extends LitElement {
    previousMessages: any[];
    static styles: import("lit").CSSResult[];
    handleInput(): Promise<void>;
    copyContent(content: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
