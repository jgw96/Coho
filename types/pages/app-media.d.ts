import { LitElement } from 'lit';
import '../components/header';
export declare class AppMedia extends LitElement {
    media: File[];
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
