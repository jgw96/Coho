import { LitElement } from 'lit';
import '../components/search';
import '../components/media-timeline';
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
export declare class SearchPage extends LitElement {
    searchData: any | undefined;
    trending: any[] | undefined;
    trendingLinks: any[] | undefined;
    static styles: import("lit").CSSResult[];
    handleSearch(search: any): Promise<void>;
    openAccount(id: string): void;
    handleHashtagClick(hashtag: string): void;
    render(): import("lit-html").TemplateResult<1>;
}
