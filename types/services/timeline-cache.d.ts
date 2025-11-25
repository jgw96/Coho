import { Post } from '../interfaces/Post';
interface TimelineCache {
    data: Post[];
    timestamp: number;
    timelineType: string;
    scrollPosition: number;
}
/**
 * Save timeline data to sessionStorage
 * @param timelineType - The type of timeline (home, public, media, etc.)
 * @param data - The timeline posts
 * @param scrollPosition - Current scroll position
 */
export declare function saveTimelineCache(timelineType: string, data: Post[], scrollPosition?: number): void;
/**
 * Retrieve timeline data from sessionStorage
 * @param timelineType - The type of timeline to retrieve
 * @returns Cached data or null if expired/missing
 */
export declare function getTimelineCache(timelineType: string): TimelineCache | null;
/**
 * Clear cache for specific timeline type
 * @param timelineType - The type of timeline to clear
 */
export declare function clearTimelineCache(timelineType?: string): void;
/**
 * Update scroll position in cache without re-saving entire dataset
 * @param timelineType - The type of timeline
 * @param scrollPosition - New scroll position
 */
export declare function updateCacheScrollPosition(timelineType: string, scrollPosition: number): void;
/**
 * Check if cache exists and is valid for a given timeline type
 * @param timelineType - The type of timeline to check
 * @returns true if valid cache exists
 */
export declare function hasFreshCache(timelineType: string): boolean;
export {};
