import type { Page } from '@playwright/test';
import { registerMockApis } from './mocks/register-api';

export const APP_URL = 'http://localhost:3000';
export const MOCK_AUTH = {
    server: 'tech.lgbt',
    token: 'mock-access-token',
};

export async function bootstrapApp(page: Page, options?: { seed?: boolean }) {
    const seed = options?.seed ?? true;

    await registerMockApis(page);
    await page.goto(APP_URL);

    if (seed) {
        await seedAuth(page);
    }
}

export async function seedAuth(page: Page) {
    await page.evaluate(({ server, token }) => {
        localStorage.setItem('server', server);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('token', token);
    }, MOCK_AUTH);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForURL('**/home', { timeout: 15000 });
}
