import type { Page, Route } from '@playwright/test';
import {
    mockAccountProfile,
    mockBookmarks,
    mockFavorites,
    mockNotifications,
    mockSearchResult,
    mockTimelinePosts,
    mockTrendingLinks,
    mockTrendingStatuses,
    mockInstanceInfo,
} from './mock-data';

const MASTODON_HOST = 'https://tech.lgbt';
const FUNCTIONS_HOST =
    'https://us-central1-coho-mastodon.cloudfunctions.net';

const jsonResponse = (route: Route, data: unknown, status = 200) =>
    route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(data),
    });

const defaultByMethod = (method: string) => {
    if (method === 'GET') {
        return [];
    }

    return { ok: true };
};

const latestTimelineId = () =>
    mockTimelinePosts[mockTimelinePosts.length - 1]?.id ?? 'post_mock_1';

async function handleMastodonRoute(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (pathname.startsWith('/api/v1/timelines')) {
        return jsonResponse(route, mockTimelinePosts);
    }

    if (pathname === '/api/v1/accounts/verify_credentials') {
        return jsonResponse(route, mockAccountProfile);
    }

    if (pathname === '/api/v1/notifications') {
        return jsonResponse(route, mockNotifications);
    }

    if (pathname === '/api/v1/instance') {
        return jsonResponse(route, mockInstanceInfo);
    }

    if (pathname === '/api/v1/trends/statuses') {
        return jsonResponse(route, mockTrendingStatuses);
    }

    if (pathname === '/api/v1/trends/links') {
        return jsonResponse(route, mockTrendingLinks);
    }

    if (pathname === '/api/v1/markers' && method === 'POST') {
        return jsonResponse(route, [
            {
                home: {
                    last_read_id: latestTimelineId(),
                },
            },
        ]);
    }

    return jsonResponse(route, defaultByMethod(method));
}

async function handleFunctionsRoute(route: Route) {
    const request = route.request();
    const url = new URL(request.url());
    const { pathname } = url;
    const method = request.method();

    if (pathname.endsWith('/getBookmarks')) {
        return jsonResponse(route, mockBookmarks);
    }

    if (pathname.endsWith('/getFavorites')) {
        return jsonResponse(route, mockFavorites);
    }

    if (pathname.endsWith('/search')) {
        return jsonResponse(route, mockSearchResult);
    }

    return jsonResponse(route, defaultByMethod(method));
}

export async function registerMockApis(page: Page) {
    await page.route(`${MASTODON_HOST}/api/v1/**`, handleMastodonRoute);
    await page.route(`${FUNCTIONS_HOST}/**`, handleFunctionsRoute);
}
