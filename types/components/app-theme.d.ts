import { LitElement } from 'lit';
import './md-button.js';
import './md-icon.js';
import { Settings } from '../services/settings';
export declare class AppTheme extends LitElement {
    primary_color: string;
    font_size: string;
    settings: Settings | undefined;
    static styles: import("lit").CSSResult[];
    connectedCallback(): Promise<void>;
    chooseColor(color: string): void;
    /**
     * Apply theme color to both Shoelace and MD3 design tokens
     */
    private applyThemeColor;
    LightenDarkenColor(col: string, amt: number): string;
    changeFontSize(size: string): void;
    customColor(): Promise<void>;
    render(): import("lit-html").TemplateResult<1>;
}
