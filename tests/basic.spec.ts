import { test, expect } from '@playwright/test';
import { bootstrapApp, seedAuth } from './test-utils';

// before each test
test.beforeEach(async ({ page }) => {
    await bootstrapApp(page, { seed: false });
});

test('ensure application loads', async ({ page }) => {
    // find the button with the text "Login"
    const loginButton = page.locator('text=Login');

    // expect loginButton to exist and be visible
    await expect(loginButton).toBeVisible();
});

test('ensure home page loads with server and token', async ({ page }) => {
    await seedAuth(page);

    // ensure the url contains /home
    expect(page.url()).toContain('/home');
});

test('ensure timeline loads on home page', async ({ page }) => {
    await seedAuth(page);

    // expect the timeline to be visible
    await expect(
        page.locator('md-tab-panel[name="general"] app-timeline')
    ).toBeVisible();
});

test('ensure that the notifications tab loads', async ({ page }) => {
    await seedAuth(page);

    // click the notifications tab
    await page.click('md-tab[panel="notifications"]');

    // expect the notifications tab to be visible
    await expect(
        page.locator('md-tab-panel[name="notifications"] app-notifications')
    ).toBeVisible();
});

test('ensure that the bookmarks tab loads', async ({ page }) => {
    await seedAuth(page);

    // click the notifications tab
    await page.click('md-tab[panel="bookmarks"]');

    // expect the notifications tab to be visible
    await expect(
        page.locator('md-tab-panel[name="bookmarks"] app-bookmarks')
    ).toBeVisible();
});

test('ensure that the search tab loads', async ({ page }) => {
    await seedAuth(page);

    // click the notifications tab
    await page.click('md-tab[panel="search"]');

    // expect the notifications tab to be visible
    await expect(
        page.locator('md-tab-panel[name="search"] search-page')
    ).toBeVisible();
});

test('ensure service worker is registered', async ({ page }) => {
    test.slow();
    await page.waitForLoadState('load');
    await expect
        .poll(async () => {
            return await page.evaluate(async () => {
                const registration = await navigator.serviceWorker.getRegistration();
                return Boolean(registration);
            });
        }, { timeout: 20000 })
        .toBe(true);
});


