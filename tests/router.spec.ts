import { test, expect } from '@playwright/test';
import { bootstrapApp } from './test-utils';

test.describe('Router', () => {
    test.beforeEach(async ({ isMobile }) => {
        if (isMobile) {
            test.skip();
        }
    });

    test('renders login page at root path', async ({ page }) => {
        await bootstrapApp(page, { seed: false });
        await expect(page.locator('app-login')).toBeVisible();
        expect(page.url()).not.toContain('/home');
    });

    test('renders home page at /home', async ({ page }) => {
        await bootstrapApp(page);
        await expect(page.locator('app-home')).toBeVisible();
        expect(page.url()).toContain('/home');
    });

    test('renders search page at /search', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/search');
        await expect(page.locator('search-page')).toBeVisible();
        expect(page.url()).toContain('/search');
    });

    test('renders profile page at /account', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/account');
        await expect(page.locator('app-profile')).toBeVisible();
        expect(page.url()).toContain('/account');
    });

    test('renders followers page at /followers', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/followers');
        await expect(page.locator('app-followers')).toBeVisible();
        expect(page.url()).toContain('/followers');
    });

    test('renders about page at /about', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/about');
        await expect(page.locator('app-about')).toBeVisible();
        expect(page.url()).toContain('/about');
    });

    test('renders messages page at /messages', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/messages');
        await expect(page.locator('app-messages')).toBeVisible();
        expect(page.url()).toContain('/messages');
    });

    test('renders following page at /following', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/following');
        await expect(page.locator('app-following')).toBeVisible();
        expect(page.url()).toContain('/following');
    });

    test('renders hashtags page at /hashtag', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/hashtag');
        await expect(page.locator('app-hashtags')).toBeVisible();
        expect(page.url()).toContain('/hashtag');
    });

    test('renders edit account page at /editaccount', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/editaccount');
        await expect(page.locator('edit-page')).toBeVisible();
        expect(page.url()).toContain('/editaccount');
    });

    test('renders explore page at /explore', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/explore');
        await expect(page.locator('app-explore')).toBeVisible();
        expect(page.url()).toContain('/explore');
    });

    test('renders media page at /media', async ({ page }) => {
        await bootstrapApp(page);
        await page.goto('/media');
        await expect(page.locator('app-media')).toBeVisible();
        expect(page.url()).toContain('/media');
    });

    test('renders create account page at /createaccount', async ({ page }) => {
        // Navigate directly without seeding auth, assuming create account is public or accessible
        // But bootstrapApp with seed:false goes to root.
        await bootstrapApp(page, { seed: false });
        await page.goto('/createaccount');
        await expect(page.locator('create-account')).toBeVisible();
        expect(page.url()).toContain('/createaccount');
    });
});
