import { LitElement } from 'lit';
/**
 * Material Design 3 Card Component
 *
 * A card is a container for content and actions on a single topic.
 * Supports elevation, variants (filled, outlined, elevated), and slotted content.
 *
 * @slot - Default slot for card body content
 * @slot header - Card header content
 * @slot footer - Card footer content (typically for actions)
 * @slot image - Card image/media content at the top
 *
 * @fires card-click - Dispatched when card is clicked (if not disabled)
 *
 * @csspart base - The card's base container
 * @csspart header - The header container
 * @csspart body - The body container
 * @csspart footer - The footer container
 */
export declare class MdCard extends LitElement {
    /** Card variant: filled, outlined, or elevated */
    variant: 'filled' | 'outlined' | 'elevated';
    /** Whether the card is clickable/interactive */
    clickable: boolean;
    /** Whether the card is disabled */
    disabled: boolean;
    static styles: import("lit").CSSResult;
    private handleClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'md-card': MdCard;
    }
}
