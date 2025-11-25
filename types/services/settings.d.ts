export interface Settings {
    primary_color?: string;
    font_size?: string;
    data_saver?: boolean;
    wellness?: boolean;
    focus?: boolean;
    sensitive?: boolean;
}
export declare function getSettings(): Promise<Settings>;
export declare function setSettings(settings: Settings): Promise<void>;
