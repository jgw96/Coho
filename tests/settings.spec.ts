import { test, expect } from '@playwright/test';
import { bootstrapApp } from './test-utils';

test.describe('Settings and theming', () => {
    test.beforeEach(async ({ page }) => {
        await bootstrapApp(page);
    });

    test('updates theme tokens when selecting a preset color', async ({ page }) => {
        await page.locator('md-icon-button#open-button').click();

        const drawer = page.locator('#theming-drawer');
        await drawer.locator('.drawer.open').waitFor();
        await drawer.locator('app-theme').waitFor();

        const colorButton = page.locator('app-theme #green');
        await colorButton.waitFor();
        await colorButton.click();

        await expect
            .poll(async () => {
                return await page.evaluate(() =>
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--sl-color-primary-600')
                        .trim()
                );
            })
            .toBe('#95b8d1');
    });

    test('toggles wellness, data saver, and sensitive switches', async ({ page }) => {
        await page.locator('md-icon-button#settings-button').click();

        const drawer = page.locator('#settings-drawer');
        await drawer.locator('.drawer.open').waitFor();

        const toggle = async (label: string) => {
            const settingBlock = drawer.locator('.setting', { hasText: label });
            await settingBlock.scrollIntoViewIfNeeded();
            const switchControl = settingBlock.locator('md-switch');
            await switchControl.locator('.control').click();
            await expect(switchControl).toHaveJSProperty('checked', true);
        };

        await toggle('Wellness Mode');
        await toggle('Data Saver Mode');
    });
});
