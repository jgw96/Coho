import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { bootstrapApp } from './test-utils';

const clickTab = async (page: Page, panel: string) => {
    await page.locator(`md-tab[panel="${panel}"]`).first().click();
};

test.describe('Home tabs content', () => {
    test.beforeEach(async ({ page }) => {
        await bootstrapApp(page);
    });

    test('displays notifications feed with follow and favourite events', async ({ page }) => {
        await clickTab(page, 'notifications');

        const panel = page.locator('md-tab-panel[name="notifications"]');
        await expect(panel.locator('app-notifications')).toBeVisible();
        await expect(panel.locator('li.follow').first()).toContainText('followed you');
        await expect(panel.locator('li.favourite').first()).toContainText('liked your post');
    });

    test('renders bookmarks timeline entries from the API', async ({ page }) => {
        await clickTab(page, 'bookmarks');

        const panel = page.locator('md-tab-panel[name="bookmarks"]');
        await expect(panel.locator('app-bookmarks')).toBeVisible();
        await expect(panel).toContainText('Saved post from your bookmarks.');
    });

    test('renders favorites timeline entries', async ({ page }) => {
        await clickTab(page, 'faves');

        const panel = page.locator('md-tab-panel[name="faves"]');
        await expect(panel.locator('app-favorites')).toBeVisible();
        await expect(panel).toContainText('Your favorited post appears here.');
    });

    test('shows search results including accounts, trends, and hashtags', async ({ page }) => {
        await clickTab(page, 'search');

        const panel = page.locator('md-tab-panel[name="search"]');
        await expect(panel.locator('search-page')).toBeVisible();
        await expect(panel).toContainText('#coho');
        await expect(panel).toContainText('Coho Mock News');
        await expect(panel.locator('timeline-item')).not.toHaveCount(0);
    });
});
