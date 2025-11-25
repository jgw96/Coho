import { LitElement } from 'lit';
export declare class ImageCarousel extends LitElement {
    images: any[];
    blurhashUrls: Map<string, string>;
    constructor();
    static styles: import("lit").CSSResult[];
    firstUpdated(): void;
    updated(changedProperties: Map<string, any>): void;
    disconnectedCallback(): void;
    private generateBlurhashes;
    private calculateImageHeight;
    private handleImageLoad;
    openInBox(image: any): Promise<void>;
    generateTemplateBasedOnType(image: any): import("lit-html").TemplateResult<1> | null;
    render(): import("lit-html").TemplateResult<1>;
}
