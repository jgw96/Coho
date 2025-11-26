import { LitElement } from 'lit';
import '../components/preview-timeline';
import '../components/md/md-text-field';
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
export declare class AppExplore extends LitElement {
    timeline: any[];
    static styles: import("lit").CSSResult[];
    firstUpdated(): Promise<void>;
    login(): Promise<void>;
    signup(): void;
    render(): import("lit-html").TemplateResult<1>;
}
