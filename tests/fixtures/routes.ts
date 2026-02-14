import type { Page } from '@playwright/test';
import { createMockSearchResults, type MockSearchResult } from './mockData';

export async function mockSearchAPI(page: Page, results?: MockSearchResult[]) {
	await page.route('**/api/journal/search', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				results: results ?? createMockSearchResults(),
				query: 'test',
				total: (results ?? createMockSearchResults()).length
			})
		});
	});
}

export async function mockSearchAPIEmpty(page: Page) {
	await page.route('**/api/journal/search', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ results: [], query: 'test', total: 0 })
		});
	});
}

export async function mockSearchAPIError(page: Page, status = 500) {
	await page.route('**/api/journal/search', async (route) => {
		await route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify({ message: 'Internal server error' })
		});
	});
}

export async function mockChatAPI(page: Page, content = 'Hello! I can help with that.') {
	await page.route('**/api/chat', async (route) => {
		const chunks = content.split(' ').map((word, i, arr) => {
			const text = i === 0 ? word : ' ' + word;
			return `data: ${JSON.stringify({ content: text })}\n\n`;
		});
		chunks.push('data: [DONE]\n\n');

		await route.fulfill({
			status: 200,
			contentType: 'text/event-stream',
			body: chunks.join('')
		});
	});
}

export async function mockChatAPIError(page: Page) {
	await page.route('**/api/chat', async (route) => {
		await route.fulfill({
			status: 500,
			contentType: 'application/json',
			body: JSON.stringify({ error: 'Internal server error' })
		});
	});
}
