import { expect, test } from '@playwright/test';

test.describe('Journal Post Detail', () => {
	test('shows 404 for non-existent post slug', async ({ page }) => {
		const response = await page.goto('/journal/non-existent-post-xyz');
		expect(response?.status()).toBe(404);
	});
});
